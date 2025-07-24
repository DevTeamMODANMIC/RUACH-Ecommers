"use client"

import { useAuth } from "@/components/auth-provider"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { submitVendorApplication } from "@/lib/firebase-vendors"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CloudinaryUploadWidget from "@/components/cloudinary-upload-widget"

const schema = z.object({
  shopName: z.string().min(3, "Shop name is required"),
  bio: z.string().min(10, "Please provide a short description"),
  logoUrl: z.string().url().nonempty("Logo is required"),
})

type FormValues = z.infer<typeof schema>

export default function VendorRegisterPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      shopName: "",
      bio: "",
      logoUrl: "",
    },
  })

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (!user) {
      alert("You must be logged in to register as a vendor")
      return
    }
    setIsSubmitting(true)
    try {
      await submitVendorApplication(user.uid, values)
      alert(
        "Your vendor application has been submitted! We will notify you once it has been reviewed.",
      )
      router.push("/")
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto pt-20 pb-40 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Vendor Application</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Shop Name</label>
              <Input type="text" {...register("shopName")} />
              {errors.shopName && (
                <p className="text-xs text-red-500 mt-1">{errors.shopName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <Textarea rows={4} {...register("bio")} />
              {errors.bio && (
                <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Logo</label>
              <CloudinaryUploadWidget
                onUploadSuccess={(_publicId: string, url: string) => setValue("logoUrl", url, { shouldValidate: true })}
                multiple={false}
              />
              {errors.logoUrl && (
                <p className="text-xs text-red-500 mt-1">{errors.logoUrl.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 