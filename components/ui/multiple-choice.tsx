"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

interface Choice {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface MultipleChoiceProps {
  title: string
  description?: string
  choices: Choice[]
  onSelect: (choiceId: string) => void
  onCancel?: () => void
  allowMultiple?: boolean
  maxSelections?: number
}

export function MultipleChoice({
  title,
  description,
  choices,
  onSelect,
  onCancel,
  allowMultiple = false,
  maxSelections,
}: MultipleChoiceProps) {
  const [selectedChoices, setSelectedChoices] = useState<string[]>([])

  const handleChoiceClick = (choiceId: string) => {
    if (allowMultiple) {
      setSelectedChoices((prev) => {
        const isSelected = prev.includes(choiceId)
        if (isSelected) {
          return prev.filter((id) => id !== choiceId)
        } else {
          if (maxSelections && prev.length >= maxSelections) {
            return prev
          }
          return [...prev, choiceId]
        }
      })
    } else {
      onSelect(choiceId)
    }
  }

  const handleConfirm = () => {
    if (allowMultiple && selectedChoices.length > 0) {
      onSelect(selectedChoices.join(","))
    }
  }

  return (
    <Card className="w-full max-w-lg bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg text-card-foreground">{title}</CardTitle>
        {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {choices.map((choice) => {
            const isSelected = allowMultiple ? selectedChoices.includes(choice.id) : false
            return (
              <button
                key={choice.id}
                onClick={() => handleChoiceClick(choice.id)}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 hover:shadow-md ${
                  isSelected ? "border-accent bg-accent/10 shadow-sm" : "border-border bg-card hover:border-accent/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {choice.icon && <div className="text-muted-foreground">{choice.icon}</div>}
                    <div>
                      <div className="font-medium text-card-foreground">{choice.label}</div>
                      {choice.description && (
                        <div className="text-sm text-muted-foreground mt-1">{choice.description}</div>
                      )}
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-accent" />}
                </div>
              </button>
            )
          })}
        </div>

        {allowMultiple && (
          <div className="flex gap-2 pt-4 border-t border-border">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} className="border-border bg-transparent">
                Cancel
              </Button>
            )}
            <Button
              onClick={handleConfirm}
              disabled={selectedChoices.length === 0}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Confirm Selection{selectedChoices.length > 1 ? "s" : ""} ({selectedChoices.length})
            </Button>
          </div>
        )}

        {!allowMultiple && onCancel && (
          <div className="pt-4 border-t border-border">
            <Button variant="outline" onClick={onCancel} className="w-full border-border bg-transparent">
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
