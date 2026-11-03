
package com.chandu.ResumeAnalyzer.ResumeExtractor;

import java.util.Locale;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

@Service
public class ResumeValidationService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "\\b[\\w.+-]+@[\\w.-]+\\.[a-zA-Z]{2,}\\b"
    );

    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "(?<!\\d)(?:\\+?\\d[\\d\\s().-]{7,}\\d)(?!\\d)"
    );

    public boolean isResume(String text) {

        if (text == null || text.isBlank()) {
            return false;
        }

        String content = text.toLowerCase(Locale.ROOT);

        String[] keywords = {
            "education",
            "experience",
            "skills",
            "projects",
            "employment",
            "work experience",
            "technical skills",
            "professional summary",
            "career objective",
            "certifications",
            "internship",
            "qualifications",
            "achievements",
            "work history",
            "academic background"
        };

        int matches = 0;

        for (String keyword : keywords) {
            if (content.contains(keyword)) {
                matches++;
            }
        }

        boolean hasEmail =
                EMAIL_PATTERN.matcher(text).find();

        boolean hasPhone =
                PHONE_PATTERN.matcher(text).find();

        boolean hasResumeSection =
                content.contains("education")
                || content.contains("experience")
                || content.contains("skills")
                || content.contains("projects")
                || content.contains("career objective")
                || content.contains("professional summary")
                || content.contains("employment")
                || content.contains("qualifications");

        // Reject very short documents
        if (content.length() < 150) {
            return false;
        }

        // Require resume-like sections and at least one contact detail
        return matches >= 3
                && hasResumeSection
                && (hasEmail || hasPhone);
    }
}
