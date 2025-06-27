# InsightGraph - Interactive Knowledge Graph Explorer

Transform your curiosity into visual knowledge. InsightGraph is an AI-powered web application that creates interactive knowledge graphs from any topic, helping you explore concepts through visual connections, detailed definitions, and curated learning resources.

![InsightGraph Demo](https://via.placeholder.com/800x400?text=InsightGraph+Demo)

## 🌟 Features

### Core Functionality
- **🧠 AI-Powered Graph Generation**: Enter any topic and watch as Google Gemini AI creates a comprehensive knowledge graph with related concepts
- **🎯 Interactive Node Exploration**: Click any concept to see detailed definitions, examples, and learning resources
- **📈 Dynamic Graph Expansion**: Expand any node to discover more related concepts and connections
- **🎨 Beautiful Visualization**: Built with React Flow for smooth, interactive graph manipulation

### Export & Sharing
- **📄 Markdown Export**: Generate structured markdown documents of your knowledge graphs
- **🖼️ PNG Export**: Save high-resolution images of your graphs for presentations or study materials
- **💾 Session Persistence**: Save and load your exploration sessions (localStorage for now, database-ready)

### User Experience
- **🖱️ Drag & Drop Interface**: Fully interactive nodes with smooth animations
- **🔍 Zoom & Pan**: Navigate large graphs with precision controls
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Fast & Reliable**: Optimized performance with intelligent caching

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Visualization**: React Flow for interactive graphs
- **AI Integration**: Google Gemini Pro API
- **Icons**: Lucide React
- **Export**: html2canvas for image generation
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/insight-graph.git
   cd insight-graph
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_google_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see InsightGraph in action!

## 📖 Usage Guide

### Creating Your First Knowledge Graph

1. **Enter Topics**: Start by typing one or more seed topics in the input form
   - Example: "Machine Learning", "Quantum Physics", "Renaissance Art"

2. **Generate Graph**: Click "Generate Graph" and watch as AI creates your knowledge map

3. **Explore Concepts**:
   - **Click nodes** to see detailed definitions and learning resources
   - **Drag nodes** to rearrange the graph layout
   - **Use zoom controls** to navigate large graphs

4. **Expand Knowledge**: Click "Expand" on any node to discover more related concepts

5. **Export & Share**:
   - **Markdown**: Perfect for study notes and documentation
   - **PNG**: Great for presentations and sharing
   - **Save**: Store your session for later exploration

### Pro Tips

- **Start Broad**: Begin with general topics, then expand into specifics
- **Multiple Seeds**: Add 2-3 related topics for richer connections
- **Explore Systematically**: Use the expand feature to build comprehensive knowledge maps
- **Save Regularly**: Your explorations are valuable - save them!

## 🔧 Project Structure

```
insight-graph/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes for AI integration
│   │   │   ├── related/      # Generate related concepts
│   │   │   └── details/      # Fetch concept details
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main application page
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── TopicInput.tsx   # Topic input form
│   │   ├── GraphCanvas.tsx  # React Flow graph
│   │   ├── ConceptNode.tsx  # Custom node component
│   │   └── NodeDialog.tsx   # Concept details modal
│   ├── lib/                 # Utility libraries
│   │   ├── api.ts          # API client functions
│   │   └── utils.ts        # General utilities
│   └── utils/               # Export utilities
│       └── export.ts        # Markdown/PNG export functions
├── public/                  # Static assets
├── package.json            # Dependencies
└── README.md              # This file
```

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.ts`
- Customize node appearance in `src/components/ConceptNode.tsx`

### AI Prompts
- Enhance concept generation in `src/app/api/related/route.ts`
- Improve detail fetching in `src/app/api/details/route.ts`

### Graph Layout
- Adjust node positioning algorithms in `src/components/GraphCanvas.tsx`
- Customize edge styles and animations

## 🔮 Roadmap

### Planned Features
- [ ] **User Authentication**: Supabase integration for user accounts
- [ ] **Cloud Storage**: Save graphs to database instead of localStorage
- [ ] **Collaborative Editing**: Share and edit graphs with others
- [ ] **Advanced Filters**: Search and filter large knowledge graphs
- [ ] **Learning Paths**: AI-generated learning sequences
- [ ] **Integration**: Connect with note-taking apps and LMS platforms

### Enhancements
- [ ] **Performance**: Virtualization for large graphs (1000+ nodes)
- [ ] **Accessibility**: Enhanced keyboard navigation and screen reader support
- [ ] **Mobile**: Native mobile app version
- [ ] **Offline Mode**: Full offline functionality with data sync

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Add JSDoc comments for new functions
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** for providing the AI capabilities
- **React Flow** for the amazing graph visualization library
- **shadcn/ui** for the beautiful UI components
- **Vercel** for seamless deployment
- **The open-source community** for inspiration and tools

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join our community discussions for help and ideas

---

**Built with ❤️ by the InsightGraph team**

*Transform curiosity into knowledge, one graph at a time.*