// app/dictionary/entry/page.tsx
"use client";

import React, { useState, type ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Pen,
  CheckCircle,
} from "lucide-react";

// Form interfaces remain the same
interface FormData {
  word: string;
  ipa: string;
  partOfSpeech: string;
}

interface StepProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
}

const INITIAL_FORM_STATE: FormData = {
  word: "",
  ipa: "",
  partOfSpeech: "",
};

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 
                ${
                  isActive
                    ? "border-primary bg-primary text-white"
                    : isCompleted
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-300 text-gray-400"
                }`}
            >
              {isCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 transition-all duration-200
                  ${index < currentStep ? "bg-primary" : "bg-gray-300"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function BasicInfoStep({ formData, updateFormData }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Pen className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">Word Details</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Word
            </label>
            <Input
              value={formData.word}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateFormData("word", e.target.value)
              }
              placeholder="Enter Kifuliiru word"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              IPA Pronunciation
            </label>
            <Input
              value={formData.ipa}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateFormData("ipa", e.target.value)
              }
              placeholder="Enter IPA pronunciation"
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1.5 text-sm text-gray-500">
              Use International Phonetic Alphabet symbols
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Part of Speech
            </label>
            <Select
              value={formData.partOfSpeech}
              onValueChange={(value) => updateFormData("partOfSpeech", value)}
            >
              <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Select part of speech" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="noun">Noun</SelectItem>
                <SelectItem value="verb">Verb</SelectItem>
                <SelectItem value="adjective">Adjective</SelectItem>
                <SelectItem value="adverb">Adverb</SelectItem>
                <SelectItem value="pronoun">Pronoun</SelectItem>
                <SelectItem value="preposition">Preposition</SelectItem>
                <SelectItem value="conjunction">Conjunction</SelectItem>
                <SelectItem value="interjection">Interjection</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ formData }: { formData: FormData }) {
  return (
    <div className="space-y-6">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-medium">Review Entry</h3>
        </div>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Word</dt>
            <dd className="mt-1 text-sm text-gray-900">{formData.word}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">
              IPA Pronunciation
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{formData.ipa}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Part of Speech
            </dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">
              {formData.partOfSpeech}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function Page() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);

  const updateFormData = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      console.log("Form submitted:", formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const steps = [
    {
      title: "Basic Information",
      description: "Enter the word details and basic information",
      component: (
        <BasicInfoStep formData={formData} updateFormData={updateFormData} />
      ),
    },
    {
      title: "Review",
      description: "Review and confirm your entry",
      component: <ReviewStep formData={formData} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-8">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              New Dictionary Entry
            </CardTitle>
            <CardDescription className="text-gray-500">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>

          <div className="px-6 py-4">
            <StepIndicator
              currentStep={currentStep}
              totalSteps={steps.length}
            />
          </div>

          <CardContent>{steps[currentStep].component}</CardContent>

          <CardFooter className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}
              className="transition-all duration-200 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              type={currentStep === steps.length - 1 ? "submit" : "button"}
              onClick={() => {
                if (currentStep < steps.length - 1) {
                  setCurrentStep((prev) => prev + 1);
                }
              }}
              className="transition-all duration-200"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Entry
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default Page;
