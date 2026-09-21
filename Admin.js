// --- CONFIGURATION ---
const SUPABASE_URL = 'https://ffjjyckrdmksulvcmiyc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmamp5Y2tyZG1rc3VsdmNtaXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MjA2ODQsImV4cCI6MjEwMzM5NjY4NH0.iQMTPWzjPdvnzVsv3dQhE9BJI2UvTQh0aAu145uGxKU';
const ADMIN_PASSKEY = 'Shade071@&x'; // Set your private dashboard passkey here

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- ACCESS CONTROL ---
const loginOverlay = document.getElementById('loginOverlay');
const passkeyInput = document.getElementById('passkeyInput');
const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', authenticate);
passkeyInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') authenticate();
});

function authenticate() {
  if (passkeyInput.value === ADMIN_PASSKEY) {
    loginOverlay.style.display = 'none';
    fetchLeads();
  } else {
    alert('Incorrect passkey.');
  }
}

// --- FETCH & DISPLAY LEADS ---
async function fetchLeads() {
  const tbody = document.getElementById('leadsTableBody');
  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Loading leads...</td></tr>';

  const { data: leads, error } = await supabaseClient
    .from('Leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    tbody.innerHTML = `<tr><td colspan="5" style="color: red;">Error: ${error.message}</td></tr>`;
    return;
  }

  if (!leads || leads.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No leads submitted yet.</td></tr>';
    return;
  }

  tbody.innerHTML = leads.map(lead => {
    const date = lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'N/A';
    const status = lead.status || 'new';

    return `
      <tr>
        <td style="white-space: nowrap; font-size: 0.85rem;">${date}</td>
        <td><strong>${escapeHtml(lead.email)}</strong></td>
        <td style="max-width: 320px; word-break: break-word;">${escapeHtml(lead.message)}</td>
        <td><span class="status-badge status-${status}">${status}</span></td>
        <td style="white-space: nowrap;">
          ${status === 'new' ? `<button class="action-btn" onclick="updateStatus('${lead.id}', 'read')">Mark Read</button>` : ''}
          ${status !== 'archived' ? `<button class="action-btn" onclick="updateStatus('${lead.id}', 'archived')">Archive</button>` : ''}
        </td>
      </tr>
    `;
  }).join('');
}

// --- UPDATE LEAD STATUS ---
async function updateStatus(id, newStatus) {
  const { error } = await supabaseClient
    .from('Leads')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    alert('Failed to update status: ' + error.message);
  } else {
    fetchLeads();
  }
}

// Helper to prevent XSS output
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

document.getElementById('refreshBtn').addEventListener('click', fetchLeads);