import { Component } from '@angular/core';
declare var Tesseract: { recognize: (arg0: string) => Promise<any>; };
// import { createWorker } from 'tesseract.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ocrAngular';
  Result = 'Recognizing...';

  selectedFile!: File; // Use the definite assignment assertion modifier
  selectedImageUrl: string = ''; // Store selected image URL
  recognizedText: string = ''; // Initialize recognizedText
  showPreloader: boolean = false; // Initialize showPreloader
  accuracyPercentage: number | null = null; // Initialize accuracyPercentage
  idType: any;

  constructor() { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.selectedImageUrl = URL.createObjectURL(this.selectedFile); // Set selected image URL
  }


  async recognizeImage(): Promise<void> {
    if (!this.selectedFile) {
      return;
    }

    this.showPreloader = true; // Show preloader

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64data = event.target?.result;
      if (base64data) {
        const dataUrl = base64data.toString();
        this.recognizedText = await this.performOCR(dataUrl);
        const idType = this.checkIdType(this.recognizedText);
        this.showPreloader = false; // Hide preloader
        this.idType = idType?.toString();
        // alert(this.recognizedText);
      }
    };
    reader.readAsDataURL(this.selectedFile);
  }

  async performOCR(dataUrl: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      Tesseract.recognize(dataUrl)
      .then((result) => {
        this.accuracyPercentage = result.confidence;
        resolve(result.text);
      })
      .catch((error) => {
        console.error('OCR Error:', error);
        reject(error);
      });
    });
  }

  checkIdType(text: string): string | null {
    let data = text.toLocaleLowerCase();
    if (data.includes("driver") && data.includes("license")) {
      return "Driver's License";
    } else if (data.includes('passport')) {
      return "Passport";
    } else if (data.includes("social security system")) {
      return "Social Security System";
    } else if (data.includes("Other Id")) {
      // Handle other types of IDs
    }
    return null; // If no matching ID type is found
  }

}
