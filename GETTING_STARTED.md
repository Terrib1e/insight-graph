# 🚀 Getting Started with InsightGraph

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy your API key

### 3. Create Environment File
Create `.env.local` in the project root:
```env
GOOGLE_API_KEY=your_actual_api_key_here
```

### 4. Start the Development Server
```bash
npm run dev
```

### 5. Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## First Use

1. **Enter a Topic**: Try "Machine Learning" or "Quantum Physics"
2. **Click "Generate Graph"**: Watch AI create your knowledge map
3. **Explore**: Click nodes for details, drag to rearrange
4. **Expand**: Click "Expand" on nodes to discover more concepts
5. **Export**: Save as Markdown or PNG when you're done

## Troubleshooting

### Common Issues

**Graph not generating?**
- Check your GOOGLE_API_KEY in `.env.local`
- Ensure you have internet connection
- Check browser console for error messages

**Styling looks broken?**
- Make sure all dependencies installed: `npm install`
- Clear browser cache and refresh

**Performance slow?**
- Large graphs (20+ nodes) may take time to render
- Try starting with 1-2 topics instead of many

### Getting Help

- Check the console for error messages
- Ensure your API key is valid and has credits
- Try simpler topics first to test functionality

## Example Topics to Try

**Technology**: Machine Learning, Blockchain, Quantum Computing
**Science**: Neuroscience, Climate Change, Genetic Engineering
**Arts**: Renaissance Art, Jazz Music, Film Theory
**Business**: Marketing Strategy, Supply Chain, Data Analytics
**Philosophy**: Ethics, Epistemology, Political Theory

## Next Steps

- Read the full [README.md](README.md) for advanced features
- Explore the codebase to understand the architecture
- Contribute improvements via GitHub issues and PRs

---

**Need help?** Open an issue on GitHub with your error messages and steps to reproduce.