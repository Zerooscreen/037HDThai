document.addEventListener('DOMContentLoaded', () => {
  const seasonItems = document.querySelectorAll('.season-item');
  
  seasonItems.forEach(item => {
    const head = item.querySelector('.season-head');
    const panel = item.querySelector('.episode-panel');
    
    if (head && panel) {
      head.addEventListener('click', async () => {
        const isActive = item.classList.toggle('active');
        
        if (isActive && !panel.innerHTML.trim()) {
          const tvId = item.getAttribute('data-tv');
          const seasonNum = item.getAttribute('data-season');
          
          panel.innerHTML = '<div style="padding: 10px; color: #aaa;">กำลังโหลดตอน...</div>';
          
          try {
            const res = await fetch(`/api/season/${tvId}/${seasonNum}`);
            const data = await res.json();
            
            if (data.episodes && data.episodes.length > 0) {
              panel.innerHTML = data.episodes.map(ep => `
                <a href="/tv/${tvId}/season/${seasonNum}/episode/${ep.number}" class="episode-row" style="display: flex; gap: 12px; padding: 10px; text-decoration: none; color: inherit; border-bottom: 1px solid #222; align-items: center;">
                  <img src="${ep.still}" alt="Ep ${ep.number}" style="width: 100px; height: 56px; object-fit: cover; border-radius: 4px; background: #111;">
                  <div style="flex: 1;">
                    <div style="font-weight: bold; color: #fff; font-size: 0.95rem;">ตอนที่ ${ep.number}: ${escapeHtml(ep.name)}</div>
                    <div style="font-size: 0.8rem; color: #aaa; margin-top: 2px;">ออกอากาศ: ${ep.airDate || '-'} · ★ ${ep.rating}</div>
                  </div>
                </a>
              `).join('');
            } else {
              panel.innerHTML = '<div style="padding: 10px; color: #aaa;">ไม่พบข้อมูลตอนในซีซั่นนี้</div>';
            }
          } catch (e) {
            panel.innerHTML = '<div style="padding: 10px; color: #e50914;">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>';
          }
        }
      });
    }
  });
});

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
