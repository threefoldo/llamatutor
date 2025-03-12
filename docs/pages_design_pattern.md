# Simulation Page Design Pattern

## Core Philosophy: Self-Discovery Through Practice

The fundamental principle guiding our simulation page design is that **students learn by discovering solutions through their own calculation efforts**. Every aspect of the design encourages meaningful calculation practice while providing conceptual guidance without revealing answers. The learning process relies on students' active problem-solving and self-validation, never on being shown correct answers. This document outlines the standardized approach for designing calculation-focused educational pages that promote discovery-based learning.

## Key Design Principles

### 1. Calculation-Centered Learning Experience
- **Prioritize Practice**: Focus on maximizing student calculation opportunities
- **Meaningful Context**: Every calculation serves a clear purpose within a realistic scenario
- **Progressive Calculation Flow**: Organize calculations that consider dependencies between values
- **Moderate Challenge Level**: Design calculations that are neither trivial nor overwhelming
- **Active Over Passive**: Students perform calculations rather than watching demonstrations

### 2. Information Architecture

#### Comprehensive Contextual Foundation
- **Complete Information Upfront**: Provide all necessary background information at the start
- **Organized Parameter Display**: Present information in logical, categorized groups
- **Visual Separation**: Clear distinction between information resources and calculation workspace
- **Reference Accessibility**: Critical information remains accessible during calculations
- **Parallel Presentation**: Present all calculations simultaneously to provide a complete overview

#### Data Retrieval Approach
- **API-Based Data**: All page data retrieved from an API with consistent schema
- **Personalized Numbers**: Each student receives different numerical values
- **Consistent Structure**: While numbers vary, the relationships and structure remain consistent
- **Persistent Schema**: Data schema remains stable for consistent calculation experience
- **Self-Contained Information**: All required data provided on the page, no external lookup needed

### 3. Calculation Structuring

#### Component-Based Calculation Design
- **Discrete Calculation Units**: Break complex processes into clearly defined calculation components
- **Logical Dependencies**: Design calculations with clear relationship patterns
- **Interconnected Results**: Some calculations may depend on results from others
- **Complexity Variation**: Include a mix of simpler and more complex calculations
- **Input-Output Clarity**: Clear indication of what inputs are needed and what output is expected

#### Structured All-at-Once Approach
- **Simultaneous Presentation**: All calculations presented at once for comprehensive overview
- **Dependency Indication**: Clear visual cues for calculations that depend on others
- **Relationship Visualization**: Help students see how calculations relate to each other
- **Order Suggestion**: Recommended (but not enforced) calculation sequence
- **Holistic Understanding**: Complete presentation encourages understanding of the entire situation

### 4. Support Systems

#### Multi-Tiered Help Structure
- **One-Click Help Access**: Immediate access to relevant support
- **Progressive Assistance Levels**:
  1. **Formula Reference**: Basic formulas with brief explanations
  2. **Calculation Hints**: Specific guidance for current calculation
  3. **Worked Examples**: Step-by-step demonstration of similar problems
  4. **Targeted Explanations**: Conceptual clarification for specific difficulties
- **Context-Sensitive Support**: Help content directly relevant to current calculation
- **Visual Help Indicators**: Clear signposting of available assistance

#### Integrated Chat Assistance
- **Always-Available Chat**: Persistent chat interface for specific questions
- **Context-Aware Responses**: Chat system informed about current calculation context
- **Strict No-Answer Policy**: AI must NEVER provide correct numerical answers or solutions
- **Concept-Only Explanations**: Explain underlying concepts without giving numerical hints
- **Methodology Guidance**: Suggest calculation approaches without working through examples
- **Formula Clarification**: Explain formulas with variables only, not with actual numbers
- **Personalized Guidance**: Tailored conceptual hints based on student's specific question
- **Process Verification**: Guide on calculation methodology without confirming specific values
- **Socratic Approach**: Use questions to help students discover errors in their own calculations

### 5. Page Structure

#### Four Content Types
- **Context Section**: Explains the goal and purpose of the task
  - Clear explanation of learning objectives
  - Real-world scenario description
  - Problem statement with expected outcomes
  - Collapsible/expandable for reference during calculations
  
- **Information Section**: Provides all necessary numerical data
  - Organized in logical, categorized groups
  - All required inputs for calculations
  - Clearly labeled parameters with appropriate units
  - Visual distinction between different data categories
  
- **Calculation Section**: Contains all required calculation inputs
  - Multiple input fields for different calculations
  - Clear labeling of expected calculations
  - Appropriate input constraints and formatting
  - Visual indication of related calculations
  
- **Feedback & Help Section**: Provides guidance and verification
  - Validation of all calculations
  - Access to formulas and help resources
  - Integrated chat interface
  - Submission and checking mechanism

### 6. Feedback Mechanisms

#### Unified Validation System
- **Never Reveal Correct Answers**: Validation should NEVER reveal the correct answer to students
- **Immediate Binary Feedback**: Only indicate if an answer is correct or incorrect
- **Visual Indication Only**: Use visual cues (colors, icons) to indicate correctness
- **Guided Discovery**: If incorrect, provide conceptual guidance rather than numerical hints
- **Self-Discovery Principle**: Students must determine correct answers through their own calculations
- **Individual Result Feedback**: Specific conceptual feedback for each calculation
- **Multiple Attempt Support**: Encouragement and progressive conceptual hints after incorrect attempts

#### Progress Recognition
- **Achievement Indicators**: Visual recognition of completed calculations
- **Process Validation**: Recognize correct calculation processes, not just final answers
- **Knowledge Building Visualization**: Show how calculations contribute to overall understanding
- **Student-Generated Insights**: Visualizations based on student's own calculations
- **Conceptual Reinforcement**: Feedback that reinforces principles rather than specific numbers
- **Extension Suggestions**: Recommendations for applying knowledge to new scenarios
- **Self-Reflection Prompts**: Questions that guide students to evaluate their own work

## Implementation Framework

### Page Structure Template

1. **Context Section**
   - Clear learning objective statement
   - Realistic problem scenario
   - Expected outcomes explanation
   - Collapsible/expandable for reference

2. **Information Section**
   - Complete set of required parameters
   - Logically organized data groups
   - Clearly labeled values with units
   - All necessary inputs for calculations

3. **Calculation Workspace**
   - Multiple calculation input fields
   - Clear labeling of expected outputs
   - Appropriate input constraints and validation
   - Single "Check" button for all calculations

4. **Help & Feedback Area**
   - Formula reference (accessible anytime)
   - Calculation hints
   - Validation feedback for all calculations
   - Integrated chat support

### Calculation Flow Design

#### Dependency-Based Structure
- **Independent Calculations**: Basic calculations with no dependencies
- **Dependent Calculations**: Calculations that use results from others
- **Parallel Calculations**: Multiple calculations using the same input data
- **Synthesis Calculations**: Calculations that combine multiple previous results

#### Natural Progression Patterns
- **Foundational To Advanced**: Natural progression from simpler to more complex
- **Part-to-Whole Relationship**: Components that build toward comprehensive understanding
- **Analytical Progression**: Moving from computation to interpretation and analysis
- **Comparative Analysis**: Calculations that enable meaningful comparisons

### Component Structure
- **AutoLayout Component**
  - Wrapper managing overall layout and sections
  - Handles collapsible sections
  - Provides consistent styling
  
- **DataDisplay Component**
  - Renders information groups with consistent styling
  - Handles formatting for different data types (currency, percentages, etc.)
  - Ensures all necessary values are clearly presented
  
- **CalculationForm Component**
  - Manages multiple input fields and their state
  - Handles error display and success states
  - Coordinates with validation system
  - Visually indicates calculation dependencies

### User Interaction Guidelines

#### Input Design
- **Appropriate Input Constraints**: Field restrictions matching expected input type
- **Clear Input Formatting**: Explicit indication of expected format (decimal places, etc.)
- **Immediate Validation**: Validate answers as soon as they're entered, without "check" buttons
- **Validation Parameters**: Reasonable tolerance for rounding differences (typically 2%)
- **Input Context**: Clear labeling of what the input represents
- **Unit Specification**: Explicit units for all values (%, $, etc.)
- **Educational Input Design**: Design inputs that force thinking rather than guessing

#### Feedback Implementation
- **Binary Feedback Only**: Only indicate if an answer is correct or incorrect, never the correct value
- **Color-Coding System**: Consistent colors for correct/incorrect indications
- **Symbolic Indicators**: Use symbols (✓/✗) instead of numerical feedback
- **Conceptual Guidance**: Provide conceptual guidance rather than numerical hints
- **Conceptual Connection**: Link feedback to underlying financial concepts
- **Visual Insight Generation**: Create visualizations using student-provided values
- **Process Inquiry**: Ask questions about the student's calculation process
- **Overall Progress Indication**: Summary of calculations completed without showing values

### API Integration Guidelines
- **Consistent Data Schema**: Maintain consistent data structure across all instances
- **Randomized Values**: Generate different numerical values while preserving relationships
- **Hidden Answer Validation**: Store correct answers server-side only, never returned to frontend
- **Binary Validation Response**: API should only return boolean validation (correct/incorrect), never answers
- **Tolerance Parameters**: Include validation tolerance in the API to account for rounding errors
- **Content Personalization**: Adapt context and scenarios slightly for personalization
- **Secure Computation**: Perform all validation calculations server-side to prevent client inspection
- **Cache Management**: Ensure consistency of values throughout a student's session
- **Answer Obfuscation**: Implement measures to prevent answer extraction from API responses

## Practical Examples

### Loan Calculator Pattern
1. **Context**: Car loan comparison scenario
2. **Information**: 
   - Vehicle details (price, features)
   - Loan terms (interest rates, duration options)
   - Additional fees and taxes
3. **Calculations**:
   - Total loan amount calculation
   - Monthly payment calculation
   - Total interest calculation
   - Total cost comparison between options

### Investment Calculator Pattern
1. **Context**: Retirement planning scenario
2. **Information**:
   - Investment options (returns, risks)
   - Time frames and contribution limits
   - Fee structures and tax considerations
3. **Calculations**:
   - Initial investment determination
   - Projected growth calculation
   - Fee impact analysis
   - Tax-adjusted return comparison

### Tax Planning Pattern
1. **Context**: Income tax optimization scenario
2. **Information**:
   - Income sources and amounts
   - Potential deductions and credits
   - Tax rates and brackets
3. **Calculations**:
   - Gross income aggregation
   - Deduction and credit application
   - Tax liability calculation
   - Effective tax rate determination

## Educational Benefits

This design pattern delivers several key educational advantages:

1. **Deep Conceptual Understanding**: By performing calculations themselves, students develop deeper understanding of financial concepts

2. **Holistic Comprehension**: Seeing all calculations simultaneously helps students understand relationships between values

3. **Self-Contained Learning**: All necessary information provided on the page eliminates distractions and focuses learning

4. **Confidence Building**: Clear structure with appropriate support builds student confidence

5. **Error-Based Learning**: Specific feedback on calculation errors creates powerful learning moments

6. **Applied Learning**: Realistic scenarios with personalized data demonstrate relevance to real-world decisions

## Implementation Considerations

When implementing this design pattern across the application:

1. **Consistent API Integration**: Ensure all pages follow consistent data retrieval patterns

2. **Calculation Dependency Visualization**: Clearly indicate which calculations depend on others

3. **Unified Help System**: Standardize help mechanisms across different page types

4. **Mobile Responsiveness**: Ensure calculation workspace functions well on various screen sizes

5. **Accessibility Compliance**: Design calculation interfaces to work with assistive technologies

6. **Performance Optimization**: Ensure feedback systems respond quickly to maintain engagement

By adhering to this design pattern, all simulation pages will provide consistent, effective learning experiences that maximize meaningful calculation practice while providing appropriate support structures.