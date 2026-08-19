document.addEventListener('click', async (e) => {
  const seasonHead = e.target.closest('.season-head');
  if (!seasonHead) return;

  const seasonItem = seasonHead.closest('.season-item');
  const panel = seasonItem.querySelector('.episode-panel');
  const tvId = seasonItem.getAttribute('data-tv');
  const seasonNumber = seasonItem.getAttribute('data-season');

  seasonItem.classList.toggle('active');

  if (panel.innerHTML.trim() !== '') return;

  panel.innerHTML = '<div style="padding:15px;color:#aaa;text-align:center;">Carregando episódios...</div>';

  try {
    const res = await fetch(`/api/season/${tvId}/${seasonNumber}`);
    const data = await res.json();

    if (data.episodes && data.episodes.length > 0) {
      panel.innerHTML = data.episodes.map(ep => `
        <a href="/watch/${tvId}/${seasonNumber}/${ep.number}" class="episode-card" style="display:flex;gap:15px;margin-bottom:12px;background:rgba(255,255,255,0.04);padding:12px;border-radius:8px;align-items:center;text-decoration:none;transition:background 0.2s;">
          <img src="${ep.still || ''}" alt="${escapeHtml(ep.name)}" style="width:130px;height:75px;object-fit:cover;border-radius:6px;background:#222;" loading="lazy">
          <div class="ep-info" style="text-align:left;flex:1;">
            <div style="font-size:12px;color:#ff2d55;font-weight:bold;margin-bottom:2px;">Episódio ${ep.episode_number || ep.number}</div>
            <div style="font-size:14px;font-weight:bold;color:#fff;margin-bottom:4px;">${escapeHtml(ep.name)}</div>
            <div style="font-size:12px;color:#aaa;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${escapeHtml(ep.overview || 'Sem descrição.')}</div>
          </div>
        </a>
      `).join('');
    } else {
      panel.innerHTML = '<div style="padding:15px;color:#aaa;text-align:center;">Nenhum episódio encontrado.</div>';
    }
  } catch (err) {
    panel.innerHTML = '<div style="padding:15px;color:#aaa;text-align:center;">Erro ao carregar episódios.</div>';
  }
});

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
