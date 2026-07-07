import "server-only"

import { connectToDatabase } from "@/lib/database"
import { Project } from "@/models/Project"
import { ServiceInquiry } from "@/models/ServiceInquiry"
import { Message } from "@/models/Message"

export interface ContentOverview {
  total: number
  published: number
  draft: number
  archived: number
}

export interface InquiryOverview {
  newInquiries: number
  unreadMessages: number
}

export async function getContentOverview(): Promise<ContentOverview> {
  await connectToDatabase()

  const [total, published, draft, archived] = await Promise.all([
    Project.countDocuments({ deletedAt: null }),
    Project.countDocuments({ deletedAt: null, status: "published" }),
    Project.countDocuments({ deletedAt: null, status: "draft" }),
    Project.countDocuments({ deletedAt: null, status: "archived" }),
  ])

  return { total, published, draft, archived }
}

export async function getInquiryOverview(): Promise<InquiryOverview> {
  await connectToDatabase()

  const [newInquiries, unreadMessages] = await Promise.all([
    ServiceInquiry.countDocuments({ status: "new" }),
    Message.countDocuments({ status: "new" }),
  ])

  return { newInquiries, unreadMessages }
}
