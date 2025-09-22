import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Filter,
  ChevronDown,
  X,
  MapPin,
  Users,
  Euro,
  Calendar,
  Star,
  Music,
  Wifi,
  Camera,
  Shield
} from "lucide-react";

interface VenueFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export const VenueFilters = ({ onFiltersChange }: VenueFiltersProps) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    capacityRange: [0, 1000],
    amenities: [] as string[],
    features: [] as string[],
    availability: {
      date: "",
      timeSlot: ""
    },
    rating: 0,
    venueTypes: [] as string[],
    cities: [] as string[]
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const amenitiesList = [
    { id: "sound-system", label: "Sound System", icon: Music },
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "led-walls", label: "LED Walls", icon: Camera },
    { id: "vip-area", label: "VIP Area", icon: Shield },
    { id: "bar", label: "Bar", icon: Users },
    { id: "dj-booth", label: "DJ Booth", icon: Music },
    { id: "natural-light", label: "Natural Light", icon: Camera },
    { id: "kitchen", label: "Kitchen Access", icon: Users }
  ];

  const featuresList = [
    "Rooftop",
    "VIP Lounge", 
    "Professional Lighting",
    "Instagram-worthy",
    "Outdoor Space",
    "Private Entrance",
    "Parking Available",
    "Public Transport"
  ];

  const venueTypesList = [
    "Nightclub",
    "Café/Bar", 
    "Studio",
    "Rooftop",
    "Gallery",
    "Restaurant",
    "Hotel",
    "Event Hall"
  ];

  const citiesList = [
    "Berlin",
    "Munich", 
    "Hamburg",
    "Cologne",
    "Frankfurt",
    "Stuttgart",
    "Düsseldorf",
    "Leipzig"
  ];

  const timeSlots = [
    "Morning (6:00-12:00)",
    "Afternoon (12:00-18:00)",
    "Evening (18:00-24:00)",
    "Late Night (24:00-6:00)"
  ];

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const newAmenities = checked
      ? [...filters.amenities, amenity]
      : filters.amenities.filter(a => a !== amenity);
    
    const newFilters = { ...filters, amenities: newAmenities };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const newFeatures = checked
      ? [...filters.features, feature]
      : filters.features.filter(f => f !== feature);
    
    const newFilters = { ...filters, features: newFeatures };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.venueTypes, type]
      : filters.venueTypes.filter(t => t !== type);
    
    const newFilters = { ...filters, venueTypes: newTypes };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const handleCityChange = (city: string, checked: boolean) => {
    const newCities = checked
      ? [...filters.cities, city]
      : filters.cities.filter(c => c !== city);
    
    const newFilters = { ...filters, cities: newCities };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const handlePriceRangeChange = (value: number[]) => {
    const newFilters = { ...filters, priceRange: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const handleCapacityRangeChange = (value: number[]) => {
    const newFilters = { ...filters, capacityRange: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
    updateActiveFiltersCount(newFilters);
  };

  const updateActiveFiltersCount = (currentFilters: typeof filters) => {
    let count = 0;
    
    if (currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 500) count++;
    if (currentFilters.capacityRange[0] > 0 || currentFilters.capacityRange[1] < 1000) count++;
    if (currentFilters.amenities.length > 0) count++;
    if (currentFilters.features.length > 0) count++;
    if (currentFilters.venueTypes.length > 0) count++;
    if (currentFilters.cities.length > 0) count++;
    if (currentFilters.availability.date) count++;
    if (currentFilters.availability.timeSlot) count++;
    if (currentFilters.rating > 0) count++;
    
    setActiveFiltersCount(count);
  };

  const clearAllFilters = () => {
    const resetFilters = {
      priceRange: [0, 500],
      capacityRange: [0, 1000],
      amenities: [],
      features: [],
      availability: { date: "", timeSlot: "" },
      rating: 0,
      venueTypes: [],
      cities: []
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
    setActiveFiltersCount(0);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <Filter className="h-4 w-4" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Filter Venues</span>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            Refine your search to find the perfect venue
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Price Range */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <div className="flex items-center space-x-2">
                <Euro className="h-4 w-4" />
                <span className="font-medium">Price Range (per hour)</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              <div className="px-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={500}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>€{filters.priceRange[0]}</span>
                  <span>€{filters.priceRange[1]}+</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Capacity */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Capacity</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              <div className="px-3">
                <Slider
                  value={filters.capacityRange}
                  onValueChange={handleCapacityRangeChange}
                  max={1000}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{filters.capacityRange[0]} people</span>
                  <span>{filters.capacityRange[1]}+ people</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Location */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Cities</span>
                {filters.cities.length > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {filters.cities.length}
                  </Badge>
                )}
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {citiesList.map((city) => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={filters.cities.includes(city)}
                      onCheckedChange={(checked) => handleCityChange(city, checked as boolean)}
                    />
                    <Label htmlFor={`city-${city}`} className="text-sm">
                      {city}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Venue Types */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Venue Types</span>
                {filters.venueTypes.length > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {filters.venueTypes.length}
                  </Badge>
                )}
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {venueTypesList.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.venueTypes.includes(type)}
                      onCheckedChange={(checked) => handleTypeChange(type, checked as boolean)}
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Amenities */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <div className="flex items-center space-x-2">
                <Music className="h-4 w-4" />
                <span className="font-medium">Amenities</span>
                {filters.amenities.length > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {filters.amenities.length}
                  </Badge>
                )}
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-1 gap-2">
                {amenitiesList.map((amenity) => {
                  const IconComponent = amenity.icon;
                  return (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={filters.amenities.includes(amenity.label)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity.label, checked as boolean)}
                      />
                      <Label htmlFor={amenity.id} className="flex items-center space-x-2 text-sm">
                        <IconComponent className="h-3 w-3" />
                        <span>{amenity.label}</span>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Features */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span className="font-medium">Special Features</span>
                {filters.features.length > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {filters.features.length}
                  </Badge>
                )}
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {featuresList.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={filters.features.includes(feature)}
                      onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                    />
                    <Label htmlFor={`feature-${feature}`} className="text-sm">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Availability */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Availability</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4">
              <div>
                <Label htmlFor="date-filter" className="text-sm font-medium">
                  Date
                </Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={filters.availability.date}
                  onChange={(e) => {
                    const newFilters = {
                      ...filters,
                      availability: { ...filters.availability, date: e.target.value }
                    };
                    setFilters(newFilters);
                    onFiltersChange(newFilters);
                    updateActiveFiltersCount(newFilters);
                  }}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Time Slot
                </Label>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <div key={slot} className="flex items-center space-x-2">
                      <Checkbox
                        id={`slot-${slot}`}
                        checked={filters.availability.timeSlot === slot}
                        onCheckedChange={(checked) => {
                          const newFilters = {
                            ...filters,
                            availability: { 
                              ...filters.availability, 
                              timeSlot: checked ? slot : "" 
                            }
                          };
                          setFilters(newFilters);
                          onFiltersChange(newFilters);
                          updateActiveFiltersCount(newFilters);
                        }}
                      />
                      <Label htmlFor={`slot-${slot}`} className="text-sm">
                        {slot}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Rating */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span className="font-medium">Minimum Rating</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.rating >= rating ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                    onClick={() => {
                      const newFilters = { ...filters, rating };
                      setFilters(newFilters);
                      onFiltersChange(newFilters);
                      updateActiveFiltersCount(newFilters);
                    }}
                  >
                    <Star className="h-3 w-3" />
                    {rating}+
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Active Filters ({activeFiltersCount})</h4>
            <div className="flex flex-wrap gap-1">
              {filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? (
                <Badge variant="secondary" className="gap-1">
                  €{filters.priceRange[0]}-{filters.priceRange[1]}
                  <button onClick={() => handlePriceRangeChange([0, 500])} className="hover:bg-muted-foreground/20 rounded-full p-0.5">
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              ) : null}
              
              {filters.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="gap-1">
                  {amenity}
                  <button onClick={() => handleAmenityChange(amenity, false)} className="hover:bg-muted-foreground/20 rounded-full p-0.5">
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              ))}
              
              {filters.cities.map((city) => (
                <Badge key={city} variant="secondary" className="gap-1">
                  {city}
                  <button onClick={() => handleCityChange(city, false)} className="hover:bg-muted-foreground/20 rounded-full p-0.5">
                    <X className="h-2 w-2" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};