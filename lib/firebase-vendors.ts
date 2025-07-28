import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface Vendor {
  uid: string // Firebase UID (also document id)
  shopName: string
  bio: string
  logoUrl: string
  approved: boolean
  createdAt: Timestamp
}

// Submit a vendor application — status set to approved: false initially
export const submitVendorApplication = async (
  uid: string,
  data: Omit<Vendor, "uid" | "approved" | "createdAt">,
) => {
  const vendorRef = doc(db, "vendors", uid)

  await setDoc(vendorRef, {
    uid,
    ...data,
    approved: false,
    createdAt: serverTimestamp(),
  })
}

// Approve a vendor application (callable from admin dashboard / server action)
export const approveVendor = async (uid: string) => {
  const vendorRef = doc(db, "vendors", uid)
  await updateDoc(vendorRef, { approved: true })
}

// Reject / delete vendor application
export const rejectVendor = async (uid: string) => {
  await updateDoc(doc(db, "vendors", uid), { approved: false })
  // or delete doc if you prefer: await deleteDoc(doc(db, "vendors", uid))
}

export const getVendor = async (uid: string): Promise<Vendor | null> => {
  const snapshot = await getDoc(doc(db, "vendors", uid))
  if (!snapshot.exists()) return null
  return snapshot.data() as Vendor
}

export const getApprovedVendors = async (): Promise<Vendor[]> => {
  const q = query(collection(db, "vendors"), where("approved", "==", true))
  const sn = await getDocs(q)
  return sn.docs.map((d) => d.data() as Vendor)
}

export const getAllVendors = async (): Promise<Vendor[]> => {
  const q = query(collection(db, "vendors"))
  const sn = await getDocs(q)
  return sn.docs.map((d) => ({ id: d.id, ...d.data() } as Vendor & { id: string }))
}

export const getVendorProducts = async (vendorId: string) => {
  const q = query(collection(db, "products"), where("vendorId", "==", vendorId))
  const sn = await getDocs(q)
  return sn.docs.map((d) => ({ id: d.id, ...d.data() }))
} 