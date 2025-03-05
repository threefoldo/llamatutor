# LlamaTutor Development Guide

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server 
- `npm run lint` - Run ESLint

## Code Style Guidelines
- **TypeScript**: Use strict typing with explicit interfaces for props and functions
- **Components**: Use functional components with React hooks
- **Imports**: External dependencies first, then local imports
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Event Handlers**: Prefix with "handle" (e.g., `handleSubmit`)
- **Error Handling**: Use try/catch for async operations with meaningful error messages
- **Styling**: Use Tailwind CSS with className strings
- **State Management**: React hooks (useState, useEffect, useRef)
- **Formatting**: 2-space indentation with trailing semicolons

## Architecture
- Next.js 14 App Router (`app/` directory)
- API routes in `app/api/`
- Components in `components/`
- Utility functions in `utils/`
- Uses Together AI API for LLM integration

## Design Principles
- **Educational Focus**: Simulations for practice environments, not instructional replacement
- **LLM Interactions**: Primary interface uses LLM for guided learning experiences
- **Calculation-Centered**: Each exercise focuses on specific financial calculations
- **Progressive Complexity**: Tiered difficulty with foundational to advanced levels
- **Authentic Context**: Real-world scenarios with practical relevance
- **Self-Directed Learning**: Students determine calculation approaches without automated tools
- **Minimalist Interface**: Single-page format with focused interactions
- **Document-Based Approach**: Uses realistic financial documents (auto financing exercises)