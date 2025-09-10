"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive" | "warning" | "info"
}

const variantConfig = {
  default: {
    icon: CheckCircle,
    iconColor: "text-accent",
    confirmButtonClass: "bg-accent hover:bg-accent/90 text-accent-foreground",
  },
  destructive: {
    icon: XCircle,
    iconColor: "text-destructive",
    confirmButtonClass: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    confirmButtonClass: "bg-yellow-500 hover:bg-yellow-600 text-white",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    confirmButtonClass: "bg-blue-500 hover:bg-blue-600 text-white",
  },
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  const config = variantConfig[variant]
  const IconComponent = config.icon

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
            </div>
          </div>
          <CardTitle className="text-lg text-card-foreground">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} className="border-border bg-transparent">
              {cancelText}
            </Button>
            <Button onClick={onConfirm} className={config.confirmButtonClass}>
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
