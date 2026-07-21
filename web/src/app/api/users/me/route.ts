import "dotenv/config"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/verifyAuth"
import { loadProfileByPubkey, loadTrustScoreByPubkey } from "@/lib/auth/verification.server"

export async function GET(request: Request) {
  const auth = await verifyAuth(request)
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [profile, trust] = await Promise.all([
    loadProfileByPubkey(auth.pubkey),
    loadTrustScoreByPubkey(auth.pubkey),
  ])

  if (!profile) {
    return Response.json({ error: "Account not found" }, { status: 404 })
  }

  const [user, vaultsCount] = await Promise.all([
    prisma.user.findUnique({ where: { pubkey: auth.pubkey }, select: { points: true } }),
    prisma.vaultMember.count({ where: { pubkey: auth.pubkey } }),
  ])

  return Response.json({ profile, trust, points: user?.points ?? 0, vaultsCount })
}

export async function DELETE(request: Request) {
  const auth = await verifyAuth(request)
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Block deletion if the user owns a vault that still has funds in it.
  const ownedVaultWithBalance = await prisma.vault.findFirst({
    where: {
      ownerPubkey: auth.pubkey,
      balance: { gt: 0 },
    },
    select: { id: true, name: true },
  })

  if (ownedVaultWithBalance) {
    return Response.json(
      { error: `Withdraw or distribute the funds in "${ownedVaultWithBalance.name}" before deleting your account.` },
      { status: 409 },
    )
  }

  // Block deletion if a transfer involving this user hasn't finished yet.
  const pendingTransfer = await prisma.pendingTransfer.findFirst({
    where: {
      OR: [{ senderPubkey: auth.pubkey }, { recipientPubkey: auth.pubkey }],
      status: { not: "submitted" },
    },
    select: { id: true },
  })

  if (pendingTransfer) {
    return Response.json(
      { error: "You have a pending transfer that hasn't completed yet. Please wait for it to finish before deleting your account." },
      { status: 409 },
    )
  }

  await prisma.user.delete({ where: { pubkey: auth.pubkey } })

  return new Response(null, { status: 204 })
}