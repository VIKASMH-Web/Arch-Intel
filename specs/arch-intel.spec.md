# Kiro Specification: Arch-Intel & Learning Catalyst

## Project Meta

- **Name**: Arch-Intel & Learning Catalyst
- **Objective**: Provide automated architectural reasoning and career guidance for students.
- **Platform**: AWS Native (Serverless)

## 1. Specifications for "Arch-Intel" (Code Analysis)

### 1.1 Intent

Enable students to paste code and receive a visual and textual explanation of the system's architecture.

### 1.2 Requirements

- **Input**: Source code (C, C++, Java, JS, TS, Python).
- **Processing**:
  - [AWS Lambda] `SecurityScanner`: Regex-based secret detection.
  - [Amazon Bedrock] `Claude 3.5 Sonnet`: Reasoning and Mermaid diagram generation.
- **Output**:
  - Architecture Explanation (Markdown).
  - Mermaid Flowchart (SVG Render).
  - Socratic Mentoring suggestions.

## 2. Specifications for "Learning Roadmaps"

### 2.1 Intent

Build personalized learning paths based on current skills or target roles.

### 2.2 Requirements

- **Input**: Skill set (JSON array).
- **Processing**: [Amazon Bedrock] Claude 3.5 Sonnet mapping skills to certifications.
- **Output**: JSON Roadmap with status tracking.

## 3. Infrastructure Specification (CDK Mapping)

### 3.1 Services

- **AWS Lambda**: `ArchIntelSecurityScanner` (128MB RAM, 3s timeout).
- **Amazon S3**: `ArchIntelCodeUploads` (Private, versioned).
- **IAM Roles**: Least-privilege access for Bedrock invocation.

## 4. Multilingual Specification

### 4.1 Supported Locales

- English (default)
- Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi.

## 5. Build Workflow (Kiro Patterns)

1. **Prompt to Spec**: Requirements defined in this `.spec.md` file.
2. **Spec to Code**: Implementation mapped to `src/app/api/...`
3. **Verification**: `scripts/pre-pr-check.js` (Simulated validation).
