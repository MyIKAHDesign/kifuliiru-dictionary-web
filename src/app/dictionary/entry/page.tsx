// app/dictionary/entry/page.tsx
"use client";

import React, { useState, type ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { Input } from "@/app/components/ui/input";

// Define the form state interface
interface FormData {
  word: string;
  ipa: string;
  partOfSpeech: string;
}

const INITIAL_FORM_STATE: FormData = {
  word: "",
  ipa: "",
  partOfSpeech: "",
};

// Define props for step components
interface StepProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
}

const BasicInfoStep = ({
  formData,
  updateFormData,
}: StepProps): JSX.Element => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Word</label>
        <Input
          value={formData.word}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateFormData("word", e.target.value)
          }
          placeholder="Enter Kifuliiru word"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          IPA Pronunciation
        </label>
        <Input
          value={formData.ipa}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            updateFormData("ipa", e.target.value)
          }
          placeholder="Enter IPA pronunciation"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Part of Speech</label>
        <Select
          value={formData.partOfSpeech}
          onValueChange={(value) => updateFormData("partOfSpeech", value)}
        >
          <SelectTrigger>
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
  );
};

const ReviewStep = ({ formData }: { formData: FormData }): JSX.Element => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Review Entry</h3>
      <div className="space-y-2">
        <p>
          <strong>Word:</strong> {formData.word}
        </p>
        <p>
          <strong>IPA:</strong> {formData.ipa}
        </p>
        <p>
          <strong>Part of Speech:</strong> {formData.partOfSpeech}
        </p>
      </div>
    </div>
  );
};

interface Step {
  title: string;
  component: React.ReactNode;
}

const DictionaryEntryForm = (): JSX.Element => {
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

  const steps: Step[] = [
    {
      title: "Basic Information",
      component: (
        <BasicInfoStep formData={formData} updateFormData={updateFormData} />
      ),
    },
    {
      title: "Review",
      component: <ReviewStep formData={formData} />,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            New Dictionary Entry - {steps[currentStep].title}
          </CardTitle>
        </CardHeader>

        <CardContent>{steps[currentStep].component}</CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 0}
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
  );
};

export default DictionaryEntryForm;
