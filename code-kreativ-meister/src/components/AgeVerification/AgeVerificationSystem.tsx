import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Calendar, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Camera, 
  Upload, 
  FileText, 
  Smartphone, 
  CreditCard,
  Globe,
  Info,
  Settings,
  UserCheck,
  ShieldCheck,
  Zap,
  Crown,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface AgeVerificationData {
  dateOfBirth: string;
  idType: 'passport' | 'id_card' | 'drivers_license';
  idNumber: string;
  idDocument?: File;
  selfieDocument?: File;
  phoneNumber: string;
  verificationMethod: 'document' | 'phone' | 'credit_card';
  isVerified: boolean;
  verificationDate?: string;
  verificationLevel: 'basic' | 'enhanced' | 'premium';
}

interface ContentRating {
  level: 'general' | 'teen' | 'mature' | 'adult';
  description: string;
  minAge: number;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

const contentRatings: ContentRating[] = [
  {
    level: 'general',
    description: 'Allgemeine Inhalte',
    minAge: 13,
    icon: <User className="h-5 w-5" />,
    color: 'bg-green-500',
    features: [
      'Grundlegende Social-Media-Features',
      'Öffentliche Videos und Streams',
      'Kommentare und Likes',
      'Follower-System',
      'Basis-Chat-Funktionen'
    ]
  },
  {
    level: 'teen',
    description: 'Jugendliche Inhalte',
    minAge: 16,
    icon: <Star className="h-5 w-5" />,
    color: 'bg-blue-500',
    features: [
      'Erweiterte Social-Features',
      'Private Nachrichten',
      'Gruppen-Chats',
      'Live-Streaming',
      'Creator-Tools'
    ]
  },
  {
    level: 'mature',
    description: 'Erwachsene Inhalte',
    minAge: 18,
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-orange-500',
    features: [
      'Nightlife-Content',
      'Party- und Club-Videos',
      'Alkohol-bezogene Inhalte',
      'Erwachsenen-Unterhaltung',
      'Premium-Features'
    ]
  },
  {
    level: 'adult',
    description: 'Nur für Erwachsene',
    minAge: 21,
    icon: <Crown className="h-5 w-5" />,
    color: 'bg-red-500',
    features: [
      'Adult-Entertainment',
      'Private Räume',
      'Exklusive Inhalte',
      'Premium-Chat-Räume',
      'Monetarisierung für Adult-Content'
    ]
  }
];

interface AgeVerificationSystemProps {
  onVerificationComplete?: (data: AgeVerificationData) => void;
  requiredLevel?: 'general' | 'teen' | 'mature' | 'adult';
  showContentRatings?: boolean;
}

export const AgeVerificationSystem: React.FC<AgeVerificationSystemProps> = ({
  onVerificationComplete,
  requiredLevel = 'general',
  showContentRatings = true
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationData, setVerificationData] = useState<Partial<AgeVerificationData>>({
    verificationMethod: 'document',
    verificationLevel: 'basic'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showContentWarning, setShowContentWarning] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [userAge, setUserAge] = useState<number | null>(null);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Handle date of birth change
  const handleDateOfBirthChange = (dateOfBirth: string) => {
    setVerificationData(prev => ({ ...prev, dateOfBirth }));
    const age = calculateAge(dateOfBirth);
    setUserAge(age);
    
    if (age < 13) {
      toast.error('Sie müssen mindestens 13 Jahre alt sein, um diese Plattform zu nutzen.');
      return;
    }
    
    // Show content warning for adult content
    const requiredAge = contentRatings.find(r => r.level === requiredLevel)?.minAge || 13;
    if (age >= requiredAge && requiredLevel === 'adult') {
      setShowContentWarning(true);
    }
  };

  // Handle file upload
  const handleFileUpload = (file: File, type: 'idDocument' | 'selfieDocument') => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Datei ist zu groß. Maximum 10MB erlaubt.');
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Ungültiges Dateiformat. Nur JPEG, PNG, WebP oder PDF erlaubt.');
      return;
    }
    
    setVerificationData(prev => ({ ...prev, [type]: file }));
    toast.success(`${type === 'idDocument' ? 'Ausweis' : 'Selfie'} hochgeladen`);
  };

  // Submit verification
  const handleVerificationSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const finalData: AgeVerificationData = {
        ...verificationData as AgeVerificationData,
        isVerified: true,
        verificationDate: new Date().toISOString()
      };
      
      // Store verification data
      localStorage.setItem('age_verification', JSON.stringify(finalData));
      
      toast.success('Altersverifikation erfolgreich abgeschlossen!');
      onVerificationComplete?.(finalData);
      
    } catch (error) {
      toast.error('Verifikation fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user meets age requirement
  const meetsAgeRequirement = (level: string): boolean => {
    if (!userAge) return false;
    const requiredAge = contentRatings.find(r => r.level === level)?.minAge || 13;
    return userAge >= requiredAge;
  };

  // Get accessible content levels
  const getAccessibleLevels = (): ContentRating[] => {
    if (!userAge) return [];
    return contentRatings.filter(rating => userAge >= rating.minAge);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-12 w-12 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold">Altersverifikation</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Zum Schutz von Minderjährigen und zur Einhaltung gesetzlicher Bestimmungen 
          benötigen wir eine Altersverifikation für bestimmte Inhalte.
        </p>
      </div>

      {/* Content Ratings Overview */}
      {showContentRatings && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Inhaltsbewertungen</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {contentRatings.map((rating) => (
                <div
                  key={rating.level}
                  className={`p-4 rounded-lg border-2 ${
                    userAge && userAge >= rating.minAge
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <div className={`p-2 rounded-full ${rating.color} text-white`}>
                      {rating.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{rating.description}</h3>
                      <p className="text-sm text-gray-600">Ab {rating.minAge} Jahren</p>
                    </div>
                  </div>
                  
                  <ul className="text-sm space-y-1">
                    {rating.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {userAge && userAge >= rating.minAge ? (
                    <Badge variant="default" className="mt-3 bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verfügbar
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="mt-3">
                      <Lock className="h-3 w-3 mr-1" />
                      Gesperrt
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Verifikationsprozess - Schritt {currentStep} von 4</CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Step 1: Date of Birth */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Calendar className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Geburtsdatum eingeben</h3>
                <p className="text-gray-600">Bitte geben Sie Ihr Geburtsdatum ein</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <Label htmlFor="dateOfBirth">Geburtsdatum</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={verificationData.dateOfBirth || ''}
                  onChange={(e) => handleDateOfBirthChange(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
                
                {userAge !== null && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Ihr Alter: {userAge} Jahre</span>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Verfügbare Inhaltsstufen:</p>
                      <div className="flex flex-wrap gap-2">
                        {getAccessibleLevels().map((level) => (
                          <Badge key={level.level} variant="default" className="bg-green-500">
                            {level.description}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!verificationData.dateOfBirth || !userAge || userAge < 13}
                  className="px-8"
                >
                  Weiter
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Verification Method */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <ShieldCheck className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Verifikationsmethode wählen</h3>
                <p className="text-gray-600">Wählen Sie Ihre bevorzugte Verifikationsmethode</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    verificationData.verificationMethod === 'document'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setVerificationData(prev => ({ ...prev, verificationMethod: 'document' }))}
                >
                  <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-center mb-2">Ausweisdokument</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Upload von Personalausweis, Reisepass oder Führerschein
                  </p>
                  <div className="mt-4 text-center">
                    <Badge variant="default">Empfohlen</Badge>
                  </div>
                </div>

                <div
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    verificationData.verificationMethod === 'phone'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setVerificationData(prev => ({ ...prev, verificationMethod: 'phone' }))}
                >
                  <Smartphone className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-center mb-2">Telefon-Verifikation</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Verifikation über SMS oder Anruf
                  </p>
                  <div className="mt-4 text-center">
                    <Badge variant="secondary">Schnell</Badge>
                  </div>
                </div>

                <div
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    verificationData.verificationMethod === 'credit_card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setVerificationData(prev => ({ ...prev, verificationMethod: 'credit_card' }))}
                >
                  <CreditCard className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-center mb-2">Kreditkarten-Verifikation</h4>
                  <p className="text-sm text-gray-600 text-center">
                    Verifikation über Kreditkarten-Daten
                  </p>
                  <div className="mt-4 text-center">
                    <Badge variant="secondary">Sicher</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Zurück
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!verificationData.verificationMethod}
                  className="px-8"
                >
                  Weiter
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Document Upload */}
          {currentStep === 3 && verificationData.verificationMethod === 'document' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Dokumente hochladen</h3>
                <p className="text-gray-600">Laden Sie Ihre Ausweisdokumente hoch</p>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-6">
                {/* ID Type Selection */}
                <div>
                  <Label>Dokumenttyp</Label>
                  <select
                    value={verificationData.idType || ''}
                    onChange={(e) => setVerificationData(prev => ({ 
                      ...prev, 
                      idType: e.target.value as any 
                    }))}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="id_card">Personalausweis</option>
                    <option value="passport">Reisepass</option>
                    <option value="drivers_license">Führerschein</option>
                  </select>
                </div>

                {/* ID Number */}
                <div>
                  <Label htmlFor="idNumber">Dokumentnummer</Label>
                  <Input
                    id="idNumber"
                    value={verificationData.idNumber || ''}
                    onChange={(e) => setVerificationData(prev => ({ 
                      ...prev, 
                      idNumber: e.target.value 
                    }))}
                    placeholder="Geben Sie die Dokumentnummer ein"
                    className="mt-1"
                  />
                </div>

                {/* Document Upload */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-medium mb-2">Ausweisdokument</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Foto oder Scan Ihres Ausweises
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'idDocument');
                      }}
                      className="hidden"
                      id="idDocument"
                    />
                    <Label htmlFor="idDocument" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>Datei auswählen</span>
                      </Button>
                    </Label>
                    {verificationData.idDocument && (
                      <div className="mt-2 text-green-600 text-sm">
                        ✓ {verificationData.idDocument.name}
                      </div>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="font-medium mb-2">Selfie mit Ausweis</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Selfie mit Ihrem Ausweisdokument
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'selfieDocument');
                      }}
                      className="hidden"
                      id="selfieDocument"
                    />
                    <Label htmlFor="selfieDocument" className="cursor-pointer">
                      <Button variant="outline" asChild>
                        <span>Foto aufnehmen</span>
                      </Button>
                    </Label>
                    {verificationData.selfieDocument && (
                      <div className="mt-2 text-green-600 text-sm">
                        ✓ {verificationData.selfieDocument.name}
                      </div>
                    )}
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Ihre Dokumente werden verschlüsselt übertragen und sicher gespeichert. 
                    Nach der Verifikation werden sie automatisch gelöscht.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="flex justify-center space-x-4 mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Zurück
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  disabled={!verificationData.idType || !verificationData.idNumber || 
                           !verificationData.idDocument || !verificationData.selfieDocument}
                  className="px-8"
                >
                  Weiter
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Terms and Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Bestätigung</h3>
                <p className="text-gray-600">Bestätigen Sie Ihre Angaben und akzeptieren Sie die Nutzungsbedingungen</p>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Verification Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Zusammenfassung</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Alter:</span>
                      <span className="font-medium">{userAge} Jahre</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Verifikationsmethode:</span>
                      <span className="font-medium">
                        {verificationData.verificationMethod === 'document' && 'Ausweisdokument'}
                        {verificationData.verificationMethod === 'phone' && 'Telefon'}
                        {verificationData.verificationMethod === 'credit_card' && 'Kreditkarte'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Verfügbare Inhalte:</span>
                      <div className="text-right">
                        {getAccessibleLevels().map((level) => (
                          <Badge key={level.level} variant="default" className="ml-1 mb-1">
                            {level.description}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Adult Content Warning */}
                {userAge && userAge >= 18 && (
                  <Alert className="border-orange-500 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <AlertDescription className="text-orange-800">
                      <strong>Wichtiger Hinweis:</strong> Diese Plattform kann Inhalte für Erwachsene enthalten. 
                      Durch die Verifikation bestätigen Sie, dass Sie volljährig sind und solche Inhalte 
                      ansehen möchten.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      Ich bestätige, dass ich die{' '}
                      <a href="/terms" className="text-blue-600 hover:underline">
                        Nutzungsbedingungen
                      </a>{' '}
                      und{' '}
                      <a href="/privacy" className="text-blue-600 hover:underline">
                        Datenschutzerklärung
                      </a>{' '}
                      gelesen und akzeptiert habe. Ich bestätige außerdem, dass alle 
                      angegebenen Informationen korrekt sind.
                    </Label>
                  </div>

                  {userAge && userAge >= 18 && (
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="adult-content"
                        checked={showContentWarning}
                        onCheckedChange={(checked) => setShowContentWarning(checked as boolean)}
                      />
                      <Label htmlFor="adult-content" className="text-sm leading-relaxed">
                        Ich bin volljährig und möchte Zugang zu Inhalten für Erwachsene haben. 
                        Mir ist bewusst, dass diese Inhalte nicht für Minderjährige geeignet sind.
                      </Label>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  Zurück
                </Button>
                <Button
                  onClick={handleVerificationSubmit}
                  disabled={!acceptedTerms || isLoading}
                  className="px-8"
                >
                  {isLoading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Verifikation läuft...
                    </>
                  ) : (
                    'Verifikation abschließen'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Warning Dialog */}
      <Dialog open={showContentWarning && userAge !== null && userAge >= 21} onOpenChange={setShowContentWarning}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Inhaltswarnung</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-800">
                Sie sind dabei, auf Inhalte für Erwachsene zuzugreifen, die explizite 
                oder sexuelle Inhalte enthalten können.
              </AlertDescription>
            </Alert>
            
            <div className="text-sm space-y-2">
              <p>Diese Inhalte sind nur für Personen ab 21 Jahren bestimmt und können enthalten:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Explizite oder sexuelle Darstellungen</li>
                <li>Adult-Entertainment-Content</li>
                <li>Nicht jugendfreie Themen</li>
                <li>Kostenpflichtige Premium-Inhalte</li>
              </ul>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowContentWarning(false)}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button
                onClick={() => {
                  setShowContentWarning(false);
                  toast.success('Zugang zu Adult-Content aktiviert');
                }}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Ich verstehe
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Age Gate Component for protecting content
export const AgeGate: React.FC<{
  requiredAge: number;
  contentType: string;
  children: React.ReactNode;
}> = ({ requiredAge, contentType, children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [userAge, setUserAge] = useState<number | null>(null);

  useEffect(() => {
    const verificationData = localStorage.getItem('age_verification');
    if (verificationData) {
      try {
        const data = JSON.parse(verificationData) as AgeVerificationData;
        if (data.isVerified && data.dateOfBirth) {
          const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
          setUserAge(age);
          setIsVerified(age >= requiredAge);
        }
      } catch (error) {
        console.error('Failed to load age verification:', error);
      }
    }
  }, [requiredAge]);

  if (!isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Altersbeschränkung</h2>
            <p className="text-gray-600 mb-6">
              Dieser {contentType} ist nur für Personen ab {requiredAge} Jahren zugänglich.
            </p>
            {userAge && userAge < requiredAge ? (
              <Alert className="border-red-500 bg-red-50 mb-4">
                <XCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-800">
                  Sie sind {userAge} Jahre alt. Für diesen Inhalt müssen Sie mindestens {requiredAge} Jahre alt sein.
                </AlertDescription>
              </Alert>
            ) : (
              <Button onClick={() => window.location.href = '/age-verification'}>
                Altersverifikation durchführen
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
