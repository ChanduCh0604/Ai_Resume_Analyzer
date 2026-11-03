package com.chandu.ResumeAnalyzer.ResumeExtractor;

import java.io.IOException;
import java.nio.file.Path;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

@Service
public class ResumeTextExtractor {

    public String extractText(String filePath) throws IOException {

        System.out.println("Reading PDF from: " + filePath);

        try (PDDocument document =
                Loader.loadPDF(Path.of(filePath).toFile())) {

            System.out.println("Total PDF pages: "
                    + document.getNumberOfPages());

            PDFTextStripper stripper = new PDFTextStripper();

            String text = stripper.getText(document);

            if (text == null || text.isBlank()) {
                System.out.println(
                        "WARNING: No readable text found in this PDF.");
                return "";
            }

            System.out.println("Text extraction successful.");
            System.out.println("Extracted character count: "
                    + text.length());

            return text;
        }
    }
}
