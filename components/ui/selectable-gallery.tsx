"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Search } from "lucide-react"

interface GalleryItem {
  id: string
  title: string
  description?: string
  imageUrl?: string
  category?: string
  tags?: string[]
}

interface SelectableGalleryProps {
  title: string
  description?: string
  items: GalleryItem[]
  onSelect: (itemId: string) => void
  onCancel?: () => void
  allowMultiple?: boolean
  maxSelections?: number
  searchable?: boolean
  categories?: string[]
}

export function SelectableGallery({
  title,
  description,
  items,
  onSelect,
  onCancel,
  allowMultiple = false,
  maxSelections,
  searchable = true,
  categories = [],
}: SelectableGalleryProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredItems = items.filter((item) => {
    const matchesSearch = searchQuery
      ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleItemClick = (itemId: string) => {
    if (allowMultiple) {
      setSelectedItems((prev) => {
        const isSelected = prev.includes(itemId)
        if (isSelected) {
          return prev.filter((id) => id !== itemId)
        } else {
          if (maxSelections && prev.length >= maxSelections) {
            return prev
          }
          return [...prev, itemId]
        }
      })
    } else {
      onSelect(itemId)
    }
  }

  const handleConfirm = () => {
    if (allowMultiple && selectedItems.length > 0) {
      onSelect(selectedItems.join(","))
    }
  }

  return (
    <Card className="w-full max-w-4xl bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg text-card-foreground">{title}</CardTitle>
        {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}

        {/* Search and Filters */}
        <div className="flex gap-4 pt-4">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {categories.length > 0 && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" ? "bg-accent text-accent-foreground" : "border-border"}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-accent text-accent-foreground" : "border-border"}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {filteredItems.map((item) => {
            const isSelected = allowMultiple ? selectedItems.includes(item.id) : false
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`relative group rounded-lg border transition-all duration-200 hover:shadow-md ${
                  isSelected ? "border-accent bg-accent/10 shadow-sm" : "border-border bg-card hover:border-accent/50"
                }`}
              >
                {/* Image */}
                <div className="aspect-square rounded-t-lg overflow-hidden bg-muted">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <div className="w-8 h-8 bg-muted-foreground/20 rounded-full mx-auto mb-2"></div>
                        <div className="text-xs">No Image</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 text-left">
                  <div className="font-medium text-sm text-card-foreground truncate">{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</div>
                  )}
                  {item.category && <div className="text-xs text-accent mt-2 font-medium">{item.category}</div>}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-border">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="border-border bg-transparent">
              Cancel
            </Button>
          )}
          {allowMultiple && (
            <Button
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Select {selectedItems.length} Item{selectedItems.length !== 1 ? "s" : ""}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
