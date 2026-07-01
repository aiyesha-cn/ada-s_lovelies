import { StrKey } from '@stellar/stellar-sdk';
import { fetchBalances } from './balances';
import { buildContributeXDR, buildWithdrawXDR } from './contract';
import { buildPaymentXDR, pollTransaction, submitSignedXDR } from './payment';
import { NETWORK_PASSPHRASE } from './stellar';
import { walletService } from './wallet';

export type TransferOperation = 'deposit' | 'withdraw' | 'transfer';
export type TransferStatus =
  | 'idle'
  | 'validating'
  | 'building'
  | 'waiting_for_signature'
  | 'submitting'
  | 'pending_confirmation'
  | 'confirmed'
  | 'failed';

export interface TransferResult {
  hash: string;
  status: 'confirmed';
  operation: TransferOperation;
  amount: number;
  sender: string;
  recipient: string;
  vaultId?: string;
  confirmedAt: string;
  message: string;
}

export interface TransferState {
  status: TransferStatus;
  operation: TransferOperation | null;
  message: string;
  error: string | null;
  result: TransferResult | null;
}

export interface TransferOptions {
  recipient?: string;
  onCompleted?: () => void | Promise<void>;
}

const defaultState: TransferState = {
  status: 'idle',
  operation: null,
  message: 'Ready',
  error: null,
  result: null,
};

let currentState: TransferState = { ...defaultState };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(patch: Partial<TransferState>) {
  currentState = {
    ...currentState,
    ...patch,
  };
  emit();
}

function formatError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'The transfer could not be completed.';
}

function normalizeAmount(amount: string | number): number {
  const parsed = typeof amount === 'number' ? amount : Number(amount);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('Please enter a positive amount.');
  }

  if (!/^(?:\d+)(?:\.\d{1,7})?$/.test(String(amount))) {
    throw new Error('USDC amounts can have up to 7 decimal places.');
  }

  return Number(parsed.toFixed(7));
}

async function validateWalletAndBalance(amount: number, operation: TransferOperation): Promise<string> {
  const wallet = walletService.getSnapshot();
  if (!wallet.isConnected || !wallet.publicKey || !wallet.address) {
    throw new Error('Connect your wallet before attempting a transfer.');
  }

  if (wallet.network !== 'testnet') {
    throw new Error('Please switch your wallet to Testnet to continue.');
  }

  if (!wallet.signerAvailable) {
    throw new Error('The wallet signer is unavailable.');
  }

  if (operation === 'deposit') {
    const balances = await fetchBalances(wallet.publicKey);
    if (Number(balances.usdc) < amount) {
      throw new Error(`Insufficient USDC balance. You only have ${balances.usdc} USDC.`);
    }
  }

  return wallet.publicKey;
}

async function signXdr(xdr: string, address: string): Promise<string> {
  const freighter = await import('@stellar/freighter-api');
  const signed = await freighter.signTransaction(xdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
    address,
  });

  if (signed?.error) {
    throw new Error(
      typeof signed.error === 'string' ? signed.error : 'The signature request was rejected.',
    );
  }

  if (!signed?.signedTxXdr) {
    throw new Error('The wallet did not return a signed transaction.');
  }

  return signed.signedTxXdr;
}

async function submitAndConfirm(signedXdr: string): Promise<string> {
  setState({ status: 'submitting', message: 'Broadcasting transaction…' });
  const hash = await submitSignedXDR(signedXdr);
  setState({ status: 'pending_confirmation', message: 'Waiting for confirmation…' });
  await pollTransaction(hash);
  return hash;
}

async function runTransfer(
  operation: TransferOperation,
  amount: string | number,
  options: TransferOptions = {},
): Promise<TransferResult> {
  const normalizedAmount = normalizeAmount(amount);
  setState({
    status: 'validating',
    operation,
    message: 'Validating transfer request…',
    error: null,
    result: null,
  });

  try {
    const sender = await validateWalletAndBalance(normalizedAmount, operation);
    let xdr: string;

    if (operation === 'deposit') {
      setState({ status: 'building', message: 'Building deposit transaction…' });
      xdr = await buildContributeXDR(sender, normalizedAmount);
    } else if (operation === 'withdraw') {
      setState({ status: 'building', message: 'Building withdrawal transaction…' });
      xdr = await buildWithdrawXDR(sender, normalizedAmount);
    } else {
      if (!options.recipient || !StrKey.isValidEd25519PublicKey(options.recipient)) {
        throw new Error('Please provide a valid Stellar recipient address.');
      }

      setState({ status: 'building', message: 'Building payment transaction…' });
      xdr = await buildPaymentXDR(sender, options.recipient, normalizedAmount.toFixed(7), 'USDC');
    }

    setState({ status: 'waiting_for_signature', message: 'Waiting for wallet approval…' });
    const signedXdr = await signXdr(xdr, sender);
    const hash = await submitAndConfirm(signedXdr);

    const result: TransferResult = {
      hash,
      status: 'confirmed',
      operation,
      amount: normalizedAmount,
      sender,
      recipient: operation === 'transfer' ? options.recipient ?? '' : 'vault',
      vaultId: operation === 'transfer' ? undefined : process.env.NEXT_PUBLIC_CONTRACT_ID ?? undefined,
      confirmedAt: new Date().toISOString(),
      message: operation === 'deposit'
        ? 'Deposit completed successfully.'
        : operation === 'withdraw'
          ? 'Withdrawal completed successfully.'
          : 'USDC transfer completed successfully.',
    };

    setState({ status: 'confirmed', message: result.message, error: null, result });
    if (options.onCompleted) {
      await options.onCompleted();
    }
    return result;
  } catch (error) {
    const message = formatError(error);
    setState({ status: 'failed', message, error: message, result: null });
    throw new Error(message);
  }
}

export async function depositUSDC(amount: string | number, options: TransferOptions = {}): Promise<TransferResult> {
  return runTransfer('deposit', amount, options);
}

export async function withdrawUSDC(amount: string | number, options: TransferOptions = {}): Promise<TransferResult> {
  return runTransfer('withdraw', amount, options);
}

export async function transferUSDC(
  recipient: string,
  amount: string | number,
  options: Omit<TransferOptions, 'recipient'> = {},
): Promise<TransferResult> {
  return runTransfer('transfer', amount, { ...options, recipient });
}

export function getTransferState(): TransferState {
  return { ...currentState };
}

export function subscribeToTransferState(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetTransferState() {
  currentState = { ...defaultState };
  emit();
}
