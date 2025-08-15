import React, { useEffect, useRef, useState } from "react";
import logo from "./asstes/images/logo.svg";
import { HITESH_SIR, PIYUSH_SIR } from "./component/ImageAssets";
//deploye
export default function App() {
  const personas = {
    hitesh: {
      name: "Hitesh Choudhary",
      accent: "#6A5AE0",
      gradient: "linear-gradient(135deg,#0f172a 0%,#111827 35%,#1e293b 100%)",
      vibe:
        "Energetic mentor, friendly, practical. Short, actionable points. Occasional Hindi slang. Emojis welcome.",
      reply: (q) =>
        `🔥 Bro, "${q}" — 3 steps: 1) Break into tiny tasks, 2) Build small POCs, 3) Share learnings. Consistency > motivation. Now go ship it! 😎`,
    },
    piyush: {
      name: "Piyush Garg",
      accent: "#34D399", 
     gradient: "linear-gradient(200deg,#1e293b 0%,#064e3b 35%,#34d399 100%)",
      vibe:
        "Direct, outcome-focused mentor. Clear instructions, no fluff. Focuses on real-world applications and career growth.",
      reply: (q) =>
        `⚡ "${q}" — Here's the deal: 1) Focus on the outcome, 2) Use industry standards, 3) Build for scale. Skip the tutorials, build real projects. What's your next move?`,
    },
  };

  const [personaKey, setPersonaKey] = useState("hitesh");
  const persona = personas[personaKey] || personas["hitesh"]; 

  const switchPersona = async (newPersona) => {
    if (newPersona !== personaKey && personas[newPersona]) {
      setPersonaKey(newPersona);
      setMessages([
        {
          id: Date.now(),
          from: "ai",
          kind: "text",
          text: `Welcome! I'm ${personas[newPersona].name}. How can I help you today?`,
        },
      ]);
    }
  };

  const clearConversationHistory = async () => {
    if (!personas[personaKey]) return;
    
    try {
      await fetch('https://mimicmind.onrender.com/api/clear-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ persona: personaKey })
      });
      
      setMessages([
        {
          id: Date.now(),
          from: "ai",
          kind: "text",
          text: `Chat history cleared! I'm ${personas[personaKey].name}. How can I help you today?`,
        },
      ]);
      
      console.log(`Conversation history cleared for ${personaKey}`);
    } catch (error) {
      console.error('Failed to clear conversation history:', error);
    }
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "ai",
      kind: "text",
      text:
        "Welcome! Choose a persona (Hitesh / Piyush) and say hi. You can also send 😀 emojis and GIFs 🎞️.",
    },
  ]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [showEmoji, setShowEmoji] = useState(false);
  const emojiList = [
    "😀", "😁", "😂", "🤣", "😊", "😎", "😍", "🤩", "😘", "🤗", 
    "🤔", "😴", "🙃", "😅", "😇", "🤝", "👏", "👌", "🤌", "👍", 
    "🔥", "🚀", "✨", "💡", "🎯", "🧠", "⚡", "💻", "📦", "🧪", 
    "🛠️", "🧩", "🧭", "🔍", "❤️", "💪", "🎉", "🎊", "💯"
  ];

  const [showGif, setShowGif] = useState(false);
  const [gifSearch, setGifSearch] = useState("");
  const [gifResults, setGifResults] = useState([]);
  const TENOR_API_KEY = "";

  const fallbackGifs = [
    "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
    "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
    "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
    "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif",
    "https://media.giphy.com/media/26xBukhJ4HutWcP9C/giphy.gif",
    "https://media.giphy.com/media/xT9IgIc0lryrxvqVGM/giphy.gif",
    "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
    "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif",
    "https://media.giphy.com/media/12XDYvMJNcmLgQ/giphy.gif",
    "https://media.giphy.com/media/26FPJGjhefSJuaRhu/giphy.gif"
  ];

  const bottomRef = useRef(null);
  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "end",
        inline: "nearest"
      });
    }, 100);
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const send = async () => {
    const text = input?.trim();
  
    if (!text) return;
  
    const myMsg = { id: Date.now(), from: "me", kind: "text", text };
    setMessages(prev => [...prev, myMsg]);
    setInput("");
    setIsTyping(true);
  
    try {
      const response = await fetch("https://mimicmind.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, persona: personaKey })
      });
  
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Backend Error ${response.status}: ${errText}`);
      }
  
      const data = await response.json();
      
      const aiMsg = {
        id: Date.now() + 1,
        from: "ai",
        kind: "text",
        text: data?.response 
      };
  
      setMessages(prev => [...prev, aiMsg]);
  
    } catch (error) {
      console.error("💥 Full error details:", error);
      const fallbackText =
        personaKey === "hitesh"
          ? "🔥 Bro, something went wrong with the AI! But here's my take: " + persona.reply(text)
          : "⚡ API error occurred. Here's my fallback response: " + persona.reply(text);
  
      const fallbackMsg = { id: Date.now() + 1, from: "ai", kind: "text", text: fallbackText };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };
  
  
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const addEmoji = (emo) => {
    setInput((v) => v + emo);
  };

  const searchGifs = async (q) => {
    setGifSearch(q);
    if (!TENOR_API_KEY || !q.trim()) {
      setGifResults([]);
      return;
    }
    try {
      const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
        q
      )}&key=${TENOR_API_KEY}&limit=18&media_filter=gif,tinygif`;
      const res = await fetch(url);
      const data = await res.json();
      const items =
        data?.results?.map(
          (r) => r?.media_formats?.tinygif?.url || r?.media_formats?.gif?.url
        ) || [];
      setGifResults(items.filter(Boolean));
    } catch {
      setGifResults([]);
    }
  };

  const sendGif = (gifUrl) => {
    const myMsg = {
      id: Date.now(),
      from: "me",
      kind: "gif",
      url: gifUrl,
    };
    setMessages((m) => [...m, myMsg]);
    setShowGif(false);
    setIsTyping(true);
    
    scrollToBottom();

    fetch('https://mimicmind.onrender.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "User just sent a GIF. Give a brief, enthusiastic response about the GIF.",
        persona: personaKey
      })
    })
    .then(response => response.json())
    .then(data => {
      const aiMsg = {
        id: Date.now() + 1,
        from: "ai",
        kind: "text",
        text: data.response,
      };
      setMessages((m) => [...m, aiMsg]);
    })
    .catch(error => {
      console.error('Error:', error);
      const fallbackText = personaKey === "hitesh"
        ? "🔥 Nice GIF! Visuals make learning fun. What's your next question?"
        : "⚡ Good one. Now, what's the outcome you're aiming for?";
      
      const aiMsg = {
        id: Date.now() + 1,
        from: "ai",
        kind: "text",
        text: fallbackText,
      };
      setMessages((m) => [...m, aiMsg]);
    })
    .finally(() => {
      setIsTyping(false);
    });
  };

  const themeAccent = persona.accent;

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
        .bg-animated {
          position: fixed; inset: 0; z-index: -2;
          background: ${persona.gradient};
        }
        .blob {
          position: absolute; z-index: -1; filter: blur(60px); opacity: .35;
          width: 420px; height: 420px; border-radius: 50%;
          animation: float 12s ease-in-out infinite;
        }
        .blob.b1 { background: radial-gradient(${themeAccent}, transparent 60%); top: -80px; left: -60px; }
        .blob.b2 { background: radial-gradient(#22d3ee, transparent 60%); bottom: -100px; right: -40px; animation-delay: 2s; }
        .blob.b3 { background: radial-gradient(#f43f5e, transparent 60%); top: 40%; left: 60%; animation-delay: 4s; }

        @keyframes float {
          0%,100% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(-30px) translateX(15px) scale(1.08); }
        }

        .nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,.08);
          backdrop-filter: blur(12px);
          background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
          position: sticky; top: 0; z-index: 5;
        }
        @media (max-width: 480px) {
          .nav {
            padding: 16px 20px;
          }
        }
        .brand { display: flex; align-items: center; gap: 14px; color: #e5e7eb; }
        .logo {
          width: 38px; height: 38px; border-radius: 12px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo svg {
          width: 100%;
          height: 100%;
        }
        .persona-toggle {
          display: flex; gap: 8px; padding: 8px; border-radius: 14px;
          background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08);
        }
        .persona-btn {
          padding: 10px 14px; border-radius: 10px; border: none; cursor: pointer;
          color: #e5e7eb; background: transparent; transition: all .2s;
          font-weight: 500; font-size: 14px;
        }
        .persona-btn.active { 
          background: ${themeAccent}33; 
          color: #fff; 
          box-shadow: 0 0 0 1px ${themeAccent}44 inset;
          transform: scale(1.05);
        }
        .persona-btn:hover { 
          transform: translateY(-1px);
          background: rgba(255,255,255,.1);
        }

        .page {
          margin: 0 auto; padding: 40px;
        }

        .hero {
          display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 24px;
          min-height: calc(100vh - 140px);
          align-items: stretch;
        }
        @media (max-width: 768px) { 
          .hero { 
            grid-template-columns: 1fr; 
            gap: 16px;
          }
          .page {
            padding: 16px;
          }
        }
        @media (max-width: 480px) {
          .hero {
            gap: 12px;
          }
          .panel {
            padding: 16px;
          }
        }

        .panel {
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px; padding: 20px; backdrop-filter: blur(16px);
          box-shadow: 0 10px 30px rgba(0,0,0,.25);
          height: calc(100vh - 200px);
          min-height: 500px;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 768px) {
          .panel {
            height: calc(100vh - 300px);
            min-height: 400px;
          }
        }

        .chat {
          height: calc(100vh - 200px);
          min-height: 500px;
          display: flex; flex-direction: column; gap: 12px; overflow: hidden;
        }
        @media (max-width: 768px) {
          .chat {
            height: calc(100vh - 300px);
            min-height: 400px;
          }
        }
        .stream {
          flex: 1; overflow-y: auto; padding-right: 6px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,.2) transparent;
        }
        .stream::-webkit-scrollbar {
          width: 6px;
        }
        .stream::-webkit-scrollbar-track {
          background: transparent;
        }
        .stream::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,.2);
          border-radius: 3px;
        }
        .bubble {
          max-width: 76%; padding: 14px 16px; border-radius: 18px; margin: 8px 0;
          line-height: 1.5; font-size: 15px; animation: pop .18s ease-out;
          border: 1px solid rgba(255,255,255,.08);
          word-wrap: break-word;
        }
        .me   { align-self: flex-end; background: ${themeAccent}1f; color: #e5e7eb; }
        .ai   { align-self: flex-start; background: rgba(255,255,255,.08); color: #e5e7eb; }
        @media (max-width: 480px) {
          .bubble {
            max-width: 85%;
            padding: 12px 14px;
            font-size: 14px;
          }
        }

        .gif {
          max-width: 280px; border-radius: 12px; display: block;
          box-shadow: 0 8px 24px rgba(0,0,0,.35); border: 1px solid rgba(255,255,255,.1);
        }

        @keyframes pop { from { transform: scale(.98); opacity: .0 } to { transform: scale(1); opacity: 1 } }

        .composer {
          display: grid; grid-template-columns: auto 1fr auto auto; gap: 12px; align-items: end;
          padding-top: 12px; border-top: 1px dashed rgba(255,255,255,.12);
        }
        @media (max-width: 480px) {
          .composer {
            gap: 8px;
            padding-top: 10px;
          }
        }
        .textarea {
          width: 100%; min-height: 56px; max-height: 140px; resize: vertical;
          padding: 14px 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,.12);
          background: rgba(0,0,0,.25); color: #e5e7eb; outline: none;
          font-size: 15px; line-height: 1.4;
          transition: border-color .2s, box-shadow .2s;
        }
        .textarea:focus {
          border-color: ${themeAccent}66;
          box-shadow: 0 0 0 3px ${themeAccent}22;
        }
        .textarea::placeholder {
          color: #94a3b8;
        }
        .iconbtn {
          width: 48px; height: 48px; border-radius: 14px; border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.06); color: #e5e7eb; cursor: pointer;
          transition: transform .12s, box-shadow .2s, background .2s, border-color .2s;
          font-size: 18px;
        }
        .iconbtn:hover { 
          transform: translateY(-1px); 
          box-shadow: 0 6px 16px rgba(0,0,0,.25);
          background: rgba(255,255,255,.1);
          border-color: rgba(255,255,255,.2);
        }
        .send {
          padding: 12px 20px; border-radius: 14px; border: 1px solid ${themeAccent}66;
          background: linear-gradient(135deg, ${themeAccent}cc, ${themeAccent}88);
          color: #fff; cursor: pointer; font-weight: 600; font-size: 15px;
          transition: transform .12s, filter .2s, box-shadow .2s;
          box-shadow: 0 4px 12px ${themeAccent}33;
        }
        .send:hover { 
          filter: brightness(1.1); 
          transform: translateY(-1px);
          box-shadow: 0 6px 20px ${themeAccent}44;
        }

        .tiny { font-size: 12px; color: #94a3b8; }
        .vibe { margin-top: 10px; color: #cbd5e1; font-size: 14px; opacity: .9; }

        .emoji-panel, .gif-modal {
          position: absolute; z-index: 10; border-radius: 16px; padding: 16px;
          background: rgba(0,0,0,.8); border: 1px solid rgba(255,255,255,.15);
          backdrop-filter: blur(16px); box-shadow: 0 20px 40px rgba(0,0,0,.4);
          animation: pop .15s ease-out;
        }
        .emoji-grid {
          display: grid; grid-template-columns: repeat(8, 1fr); gap: 8px; max-width: 320px;
        }
        .emoji-btn {
          font-size: 22px; background: transparent; border: none; cursor: pointer;
          width: 40px; height: 40px; border-radius: 10px;
          transition: all .15s;
        }
        .emoji-btn:hover { 
          background: rgba(255,255,255,.15);
          transform: scale(1.1);
        }

        .gif-modal { inset: 0; display: grid; place-items: center; }
        .gif-card {
          width: min(920px, 92vw); max-height: 80vh; overflow: hidden;
        }
        .gif-header { display: flex; gap: 12px; align-items: center; }
        .gif-search {
          flex: 1; padding: 12px 16px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,.15); background: rgba(0,0,0,.4); color: #e5e7eb;
          font-size: 15px;
        }
        .gif-search:focus {
          outline: none;
          border-color: ${themeAccent}66;
          box-shadow: 0 0 0 3px ${themeAccent}22;
        }
        .gif-grid {
          margin-top: 16px; overflow: auto; max-height: 62vh;
          display: grid; grid-template-columns: repeat(auto-fill,minmax(160px,1fr)); gap: 12px;
        }
        .gif-item {
          border-radius: 14px; overflow: hidden; cursor: pointer; border: 1px solid rgba(255,255,255,.1);
          transition: transform .15s, box-shadow .2s;
        }
        .gif-item:hover { 
          transform: translateY(-3px); 
          box-shadow: 0 12px 28px rgba(0,0,0,.4);
          border-color: ${themeAccent}66;
        }

        .typing {
          display: inline-flex; gap: 4px; align-items: center; padding: 10px 12px;
          background: rgba(255,255,255,.08); border-radius: 12px; margin: 4px 0;
          border: 1px solid rgba(255,255,255,.08);
        }
        .dot { width: 6px; height: 6px; background: #e5e7eb; border-radius: 50%; animation: bounce 1s infinite; }
        .dot:nth-child(2){ animation-delay: .15s } .dot:nth-child(3){ animation-delay: .3s }
        @keyframes bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
      `}</style>

      <div className="bg-animated" />
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />

      <nav className="nav">
        <div className="brand">
          <div className="logo">
            <svg width="2000" height="2000" viewBox="0 0 2000 2000" stroke="#B0B0B0" fill="#B0B0B0" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M577.01 773.174c-.451 3.527 1.81 7.818 6.331 16.401L1117.43 1803.52c2.46 4.68 3.7 7.03 5.55 8.5 1 .79 2.12 1.41 3.32 1.83 28.51 20.3 130.79 12.59 246.39-20.47 117.49-33.59 211.34-88.69 221.94-122.06.43-.72.78-1.49 1.04-2.29.73-2.24.47-4.87-.05-10.11l-88.63-893.466c-.57-5.817-.86-8.725-2.19-10.909a11.23 11.23 0 0 0-4.92-4.392c-2.32-1.066-5.25-1.02-11.09-.929l-889.797 13.95c-9.7.152-14.549.228-17.428 2.316a11.26 11.26 0 0 0-4.555 7.684Z" fill="#FE9332"/>
              <path d="M1507.79 760.427c-.65 63.101-207.62 111.366-468.81 108.688-261.194-2.678-465.548-45.025-464.901-108.125s206.05-123.061 467.241-120.383 467.11 56.719 466.47 119.82Z" fill="#FF7D0C"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M1550.93 228.057c-1.07-12.387-11.99-21.558-24.37-20.485-12.39 1.073-21.56 11.985-20.49 24.372l125.67 1450.336c.54 2.24.73 4.54.6 6.89l.04.49c-.03-.01-.05-.01-.08-.01-2.95 37.71-92.11 88.78-258.4 137.06-172.87 50.18-276.27 47.2-294.64 17.18-.01.01-.02.01-.03.02l-.33-.62c-.25-.44-.48-.88-.69-1.33L394.815 529.664c-5.743-11.028-19.338-15.312-30.366-9.569s-15.312 19.338-9.569 30.365l693.16 1331.05c1.11 2.13 2.51 4.01 4.13 5.61 17.18 27.88 166.06 29.99 332.52-19.31 152.93-45.29 271.73-97.49 292.19-140.5 1.46-2.59 2.43-5.49 2.77-8.55.44-2.62.47-5.2.08-7.74-.11-.7-.27-1.38-.49-2.05z"/>
              <path d="M932.328 283.002C1098 238.611 1247.64 214.748 1357.32 210.36c55.07-2.203 98.56.574 128.49 7.373 15.01 3.408 25.13 7.503 31.32 11.401 2.99 1.885 4.63 3.447 5.46 4.443.4.483.61.822.7 1.006.1.177.12.27.13.305s.03.1.03.245c.01.152 0 .476-.09 1.008-.2 1.101-.79 3.087-2.4 6.026-3.36 6.11-10.03 14.313-21.42 24.327-22.71 19.973-59.27 42.929-108.48 67.363-97.98 48.649-240.34 100.373-406.295 144.842-165.805 44.427-318.862 70.533-431.992 77.105-56.801 3.299-102.026 1.575-133.295-4.525-15.699-3.063-26.285-6.934-32.743-10.704-4.324-2.525-5.68-4.305-6.027-4.893.007-.683.291-2.903 2.773-7.251 3.708-6.494 10.94-15.14 23.004-25.641 24.031-20.918 62.334-45.023 113.175-70.567 101.259-50.874 246.864-104.793 412.668-149.221Z" fill="none" strokeWidth="56.281"/>
              <path d="m990.214 1303.45 135.216 9.56c6.4 21.56 9.38 37.25 8.94 47.06l-196.728-19.23-11.429-38.5 151.767-132.19c5.62 7.64 11.68 22.41 18.19 44.31zm338.106-50.68 108.09-81.79-137.35-16.76c-5.18-17.45-7.37-32.99-6.58-46.63l196.96 27.53 11.42 38.5-154.36 123.47c-5.72-7.99-11.78-22.76-18.18-44.32Zm-156.81 189.1 39.34-406.29 42.13-9.28-39.34 406.29z" fill="#000"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, letterSpacing: 0.2, color: "#fff" }}>
              Chai or Code — Persona Chat
            </div>
            <div className="tiny">Hitesh & Piyush style mimic • Emojis & GIFs</div>
          </div>
        </div>

        <div className="persona-toggle">
          <button
            className={`persona-btn ${personaKey === "hitesh" ? "active" : ""}`}
            onClick={() => switchPersona("hitesh")}
            title="Hitesh Choudhary"
          >
            Hitesh Choudhary
          </button>
          <button
            className={`persona-btn ${personaKey === "piyush" ? "active" : ""}`}
            onClick={() => switchPersona("piyush")}
            title="Piyush Garg"
          >
           Piyush Garg
          </button>
        </div>
      </nav>

      <div className="page">
        <div className="hero">
          <section className="panel" style={{ borderColor: `${themeAccent}44` }}>
          <img
        src={personaKey==='piyush'? PIYUSH_SIR: HITESH_SIR}
    
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          marginRight: '10px'
        }}
      />
            <h2 style={{ margin: 0, color: "#e2e8f0" }}>{persona.name}</h2>
            <div className="tiny" style={{ marginTop: 4, color: "#94a3b8" }}>
              Theme accent adapts to persona • Try switching!
            </div>
            <div className="vibe">Tone: {persona.vibe}</div>
            <div
              style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 12,
                border: `1px dashed ${themeAccent}66`,
                color: "#cbd5e1",
              }}
            >
              Pro tip: Use 😀 to open emoji panel, 🎞️ for GIFs, and <b>Shift+Enter</b> for
              new lines.
            </div>
          </section>

          <section className="panel chat" style={{ borderColor: `${themeAccent}44` }}>
            <div className="stream">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`bubble ${m.from === "me" ? "me" : "ai"}`}
                >
                 
                  {m.kind === "text" ? (
                    <span>{m?.text}</span>
                  ) : (
                    <img className="gif" src={m.url} alt="gif" />
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="typing">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="composer" style={{ position: "relative" }}>
              <button
                className="iconbtn"
                title="Emoji"
                onClick={() => setShowEmoji((s) => !s)}
              >
                😀
              </button>

              <textarea
                className="textarea"
                placeholder={`Message ${persona.name}…`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
              />

              <button
                className="iconbtn"
                title="GIFs"
                onClick={() => setShowGif(true)}
              >
                🎞️
              </button>

              <button className="send" onClick={send}>
                Send
              </button>

              {/* Emoji Panel */}
              {showEmoji && (
                <div
                  className="emoji-panel"
                  style={{ bottom: 70, left: 6 }}
                  onMouseLeave={() => setShowEmoji(false)}
                >
                  <div className="emoji-grid">
                    {emojiList.map((e, i) => (
                      <button
                        key={i}
                        className="emoji-btn"
                        onClick={() => addEmoji(e)}
                        title={e}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {showGif && (
        <div className="gif-modal">
          <div className="panel gif-card" style={{ borderColor: `${themeAccent}44` }}>
            <div className="gif-header">
              <input
                className="gif-search"
                placeholder="Search GIFs (Tenor)…"
                value={gifSearch}
                onChange={(e) => {
                  const q = e.target.value;
                  searchGifs(q);
                }}
              />
              <button className="iconbtn" onClick={() => setShowGif(false)}>
                ✖
              </button>
            </div>

            <div className="tiny" style={{ marginTop: 6 }}>
              {TENOR_API_KEY
                ? "Results powered by Tenor"
                : "No API key set — showing a small, built-in GIF set."}
            </div>

            <div className="gif-grid" style={{ marginTop: 8 }}>
              {(TENOR_API_KEY && gifResults.length ? gifResults : fallbackGifs).map(
                (url, idx) => (
                  <div key={idx} className="gif-item" onClick={() => sendGif(url)}>
                    <img src={url} alt="gif" style={{ width: "100%", display: "block" }} />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}