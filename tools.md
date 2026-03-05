---
layout: page
title: Tools
permalink: /tools/
---

<div class="detail-page">
  <div class="about-content">

    <div class="intro-box">
      <h2>🛠️ Tools & Applications</h2>
      <p>Interactive tools for music, linguistics, and language learning — built for researchers, musicians, and learners.</p>
    </div>

    <div class="tools-grid">

      <!-- Palta Maker Card -->
      <div class="tool-card" onclick="openTool('palta-maker')">
        <div class="tool-icon">🎵</div>
        <div class="tool-info">
          <h3>Alankar / Palta Maker</h3>
          <p>Generate classical Hindustani music practice patterns (alankars and paltas) across swaras, speeds, and laya. Useful for vocalists and instrumentalists at all levels.</p>
        </div>
        <div class="tool-launch">Open Tool →</div>
      </div>

      <!-- Add more tool cards here in future -->

    </div>

    <!-- Tool Embed Area -->
    <div class="tool-embed" id="tool-embed" style="display:none;">
      <div class="tool-embed-header">
        <span id="tool-embed-title"></span>
        <button class="tool-close-btn" onclick="closeTool()">✕ Close</button>
      </div>
      <iframe id="tool-iframe" src="" frameborder="0" allowfullscreen></iframe>
    </div>

  </div>
</div>

<style>
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.tool-card {
  background: #ffffff !important;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(8,37,103,0.15);
  border-color: #082567;
}

.tool-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.tool-info h3 {
  color: #082567 !important;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.tool-info p {
  color: #333333 !important;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  text-align: left !important;
}

.tool-launch {
  margin-top: auto;
  color: #082567 !important;
  font-weight: 600;
  font-size: 0.95rem;
}

.tool-embed {
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(8,37,103,0.15);
  border: 1px solid #e5e7eb;
}

.tool-embed-header {
  background: #082567;
  color: #ffffff;
  padding: 0.75rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 1rem;
}

.tool-close-btn {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.tool-close-btn:hover {
  background: rgba(255,255,255,0.25);
}

#tool-iframe {
  width: 100%;
  height: 700px;
  display: block;
  background: #ffffff;
}

@media (max-width: 768px) {
  #tool-iframe {
    height: 500px;
  }
}
</style>

<script>
var tools = {
  'palta-maker': {
    title: '🎵 Alankar / Palta Maker',
    src: '/assets/tools/palta-maker.html'
  }
  // Add more tools here as:
  // 'tool-id': { title: '...', src: '/assets/tools/tool-file.html' }
};

function openTool(id) {
  var tool = tools[id];
  if (!tool) return;
  document.getElementById('tool-embed-title').textContent = tool.title;
  document.getElementById('tool-iframe').src = tool.src;
  var embed = document.getElementById('tool-embed');
  embed.style.display = 'block';
  setTimeout(function() {
    embed.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 50);
}

function closeTool() {
  document.getElementById('tool-embed').style.display = 'none';
  document.getElementById('tool-iframe').src = '';
}
</script>
