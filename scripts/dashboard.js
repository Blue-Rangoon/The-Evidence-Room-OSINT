const tools = {
    username: { title: 'Username Footprint', icon: 'bi-person-badge', helper: 'Scan common platforms to see where a username is registered.', placeholder: 'Enter username, e.g. johndoe', button: 'Scan', type: 'Username' },
    email: { title: 'Email Intelligence', icon: 'bi-envelope-at', helper: 'Verify email format, domain metadata, MX records, and breach exposure.', placeholder: 'target@example.com', button: 'Analyze', type: 'Email' },
    ip: { title: 'IP Intelligence', icon: 'bi-geo-alt', helper: 'Geolocate an IP address and fetch ISP, ASN, and network details.', placeholder: '8.8.8.8', button: 'Trace', type: 'IP Lookup' },
    domain: { title: 'Domain Scanner', icon: 'bi-globe2', helper: 'Retrieve DNS records, WHOIS-style data, SSL status, and server information.', placeholder: 'example.com', button: 'Probe', type: 'Domain' },
    breach: { title: 'Breach Monitor', icon: 'bi-shield-exclamation', helper: 'Check if a username or email appears in known breach datasets.', placeholder: 'email or username', button: 'Check', type: 'Breach' },
    phone: { title: 'Phone Intelligence', icon: 'bi-phone', helper: 'Identify carrier, line type, and geographic origin for a phone number.', placeholder: '+1 555 123 4567', button: 'Lookup', type: 'Phone' },
    subdomain: { title: 'Subdomain Discovery', icon: 'bi-diagram-3', helper: 'Enumerate common subdomains and DNS entries for a target domain.', placeholder: 'example.com', button: 'Enumerate', type: 'Subdomain' },
    ssl: { title: 'SSL Certificate Analyzer', icon: 'bi-lock', helper: 'Inspect certificate metadata, issuer, SANs, and validity windows.', placeholder: 'example.com', button: 'Inspect', type: 'SSL' },
    mac: { title: 'MAC Address Lookup', icon: 'bi-upc-scan', helper: 'Identify hardware vendor and OUI registration from a MAC address.', placeholder: '00:1B:44:11:3A:B7', button: 'Identify', type: 'MAC' },
    url: { title: 'URL Expander', icon: 'bi-link-45deg', helper: 'Unshorten URLs and reveal redirect chains and final destinations.', placeholder: 'https://bit.ly/demo', button: 'Expand', type: 'URL' }
};

const successBadge = 'px-2 py-1 rounded text-[10px] font-bold bg-green-900/50 text-green-400 border border-green-800';
const errorBadge = 'px-2 py-1 rounded text-[10px] font-bold bg-red-900/50 text-red-400 border border-red-800';
const warnBadge = 'px-2 py-1 rounded text-[10px] font-bold bg-yellow-900/50 text-yellow-400 border border-yellow-800';
const activity = [
    { target: 'johndoe', type: 'Username', status: 'SUCCESS', badge: successBadge, time: '2 mins ago' },
    { target: '8.8.8.8', type: 'IP Lookup', status: 'SUCCESS', badge: successBadge, time: '15 mins ago' },
    { target: 'example.com', type: 'Domain', status: 'PARTIAL', badge: warnBadge, time: '1 hour ago' }
];

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-view]').forEach((button) => {
        button.addEventListener('click', () => showView(button.dataset.view));
    });
    document.getElementById('open-sidebar').addEventListener('click', openSidebar);
    document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
    document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);
    document.getElementById('quick-search').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') showToast('Quick search routed to Username Search', 'info');
    });
    showView('dashboard');
});

function showView(view) {
    document.querySelectorAll('[data-view]').forEach((el) => el.classList.toggle('active', el.dataset.view === view));
    if (view === 'dashboard') renderDashboard();
    else if (view === 'settings') renderSettings();
    else renderTool(view);
    closeSidebar();
}

function openSidebar() {
    document.getElementById('sidebar').classList.remove('-translate-x-full');
    document.getElementById('sidebar-overlay').classList.remove('hidden');
}

function closeSidebar() {
    if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.add('-translate-x-full');
        document.getElementById('sidebar-overlay').classList.add('hidden');
    }
}

function renderDashboard() {
    const root = document.getElementById('view-root');
    root.innerHTML = `
        <div class="fade-in">
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-white mb-1">Terminal Overview</h2>
                <p class="text-[#94a3b8] text-sm">System status and recent investigation activity.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="glass-panel p-5 border-l-2 border-l-[#7fff00]"><div class="text-[#94a3b8] text-sm mb-1">Total Searches</div><div class="text-3xl font-bold text-white mb-2">1,204</div><div class="text-xs text-[#7fff00]"><i class="bi bi-arrow-up-right"></i> +12% this week</div></div>
                <div class="glass-panel p-5 border-l-2 border-l-blue-500"><div class="text-[#94a3b8] text-sm mb-1">API Health</div><div class="text-3xl font-bold text-white mb-2">99.9%</div><div class="text-xs text-blue-400">All systems operational</div></div>
                <div class="glass-panel p-5 border-l-2 border-l-purple-500"><div class="text-[#94a3b8] text-sm mb-1">Data Correlated</div><div class="text-3xl font-bold text-white mb-2">45 MB</div><div class="text-xs text-purple-400">Stored locally in session</div></div>
            </div>
            <h3 class="text-lg font-semibold text-white mb-4">Quick Access</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                ${Object.entries(tools).map(([key, tool]) => `<button onclick="showView('${key}')" class="glass-panel p-4 text-center glow-box group"><i class="bi ${tool.icon} text-2xl text-[#94a3b8] group-hover:text-[#7fff00] transition mb-2 block"></i><span class="text-sm font-medium">${shortLabel(tool.title)}</span></button>`).join('')}
            </div>
            ${activityTable()}
        </div>`;
}

function renderSettings() {
    document.getElementById('view-root').innerHTML = `
        <div class="fade-in">
            <div class="mb-6"><h2 class="text-2xl font-bold text-white mb-1"><i class="bi bi-gear text-[#7fff00] mr-2"></i>Settings</h2><p class="text-[#94a3b8] text-sm">Configure API keys and dashboard preferences.</p></div>
            <div class="glass-panel p-6 mb-6 max-w-2xl">
                <h3 class="text-lg font-medium text-white mb-4 border-b border-white/10 pb-2">API Configuration</h3>
                <div class="space-y-4">
                    <label class="block"><span class="block text-sm font-medium text-[#94a3b8] mb-1">Hunter.io API Key</span><input type="password" value="************************" class="bg-[#0a0a0f] border border-white/10 text-[#94a3b8] text-sm rounded-lg block w-full p-2.5" disabled></label>
                    <label class="block"><span class="block text-sm font-medium text-[#94a3b8] mb-1">Shodan API Key</span><input type="password" placeholder="Enter Shodan Key" class="input-glow bg-[#0a0a0f] border border-white/10 text-white text-sm rounded-lg block w-full p-2.5"></label>
                    <button class="bg-[#1f2937] text-white border border-white/10 px-4 py-2 rounded hover:bg-white/5 transition" onclick="showToast('Settings saved successfully')">Save Configuration</button>
                </div>
            </div>
            <div class="glass-panel p-6 max-w-2xl border border-red-900/50 bg-red-900/10"><h3 class="text-lg font-medium text-red-400 mb-2">Danger Zone</h3><p class="text-sm text-[#94a3b8] mb-4">Clear all local investigation history and cached data.</p><button class="bg-red-900/50 text-red-200 border border-red-800 px-4 py-2 rounded hover:bg-red-800 transition" onclick="clearData()">Clear All Data</button></div>
        </div>`;
}

function renderTool(key) {
    const tool = tools[key];
    document.getElementById('view-root').innerHTML = `
        <div class="fade-in">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-white mb-1"><i class="bi ${tool.icon} text-[#7fff00] mr-2"></i>${tool.title}</h2>
                <p class="text-[#94a3b8] text-sm">${tool.helper}</p>
            </div>
            <div class="glass-panel p-6 mb-6">
                <form id="tool-form" class="flex flex-col sm:flex-row gap-4">
                    <div class="relative flex-grow">
                        <i class="bi ${tool.icon} absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"></i>
                        <input id="tool-input" required placeholder="${tool.placeholder}" class="input-glow bg-[#0a0a0f] border border-white/10 text-white text-sm rounded-lg block w-full pl-10 p-3 transition-all">
                    </div>
                    <button id="tool-submit" type="submit" class="bg-[#7fff00] text-black px-6 py-2 rounded-lg font-semibold hover:bg-green-400 transition shadow-[0_0_10px_rgba(127,255,0,0.2)] flex items-center gap-2 min-w-[130px] justify-center"><span>${tool.button}</span> <i class="bi bi-search"></i></button>
                </form>
            </div>
            <div id="result-panel" class="hidden glass-panel p-6"></div>
        </div>`;

    document.getElementById('tool-form').addEventListener('submit', (event) => handleToolSubmit(event, key));
}

async function handleToolSubmit(event, key) {
    event.preventDefault();
    const input = document.getElementById('tool-input');
    const button = document.getElementById('tool-submit');
    const panel = document.getElementById('result-panel');
    const value = sanitizeTarget(input.value);
    if (!value) return;
    input.value = value;

    button.disabled = true;
    button.innerHTML = '<i class="bi bi-arrow-repeat animate-spin"></i> Running...';
    panel.classList.remove('hidden');
    panel.innerHTML = loadingHtml();

    try {
        let html = '';
        if (key === 'username') html = usernameResults(value);
        if (key === 'email') html = emailResults(value);
        if (key === 'ip') html = await ipResults(value);
        if (key === 'domain') html = domainResults(value);
        if (key === 'breach') html = breachResults(value);
        if (key === 'phone') html = phoneResults(value);
        if (key === 'subdomain') html = subdomainResults(value);
        if (key === 'ssl') html = sslResults(value);
        if (key === 'mac') html = macResults(value);
        if (key === 'url') html = urlResults(value);
        panel.innerHTML = html;
        addActivity(value, tools[key].type, successBadge, key === 'breach' ? 'EXPOSED' : 'SUCCESS');
        showToast(`${tools[key].title} complete`);
    } catch (error) {
        panel.innerHTML = `<div class="text-center py-8 text-red-400"><i class="bi bi-exclamation-triangle text-4xl mb-2 block"></i><p class="font-bold">Lookup Failed</p><p class="text-sm text-[#94a3b8]">${error.message}</p></div>`;
        addActivity(value, tools[key].type, errorBadge, 'ERROR');
        showToast(error.message, 'error');
    }

    button.disabled = false;
    button.innerHTML = `<span>${tools[key].button}</span> <i class="bi bi-search"></i>`;
}

function usernameResults(username) {
    const seed = [...username].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const found = (bias) => (seed % 7 + bias) % 5 !== 0;
    const platforms = [
        ['Instagram', 'bi-instagram', `https://instagram.com/${username}`, found(1)],
        ['Twitter/X', 'bi-twitter-x', `https://twitter.com/${username}`, found(2)],
        ['GitHub', 'bi-github', `https://github.com/${username}`, found(3)],
        ['LinkedIn', 'bi-linkedin', `https://linkedin.com/in/${username}`, found(1)],
        ['Reddit', 'bi-reddit', `https://reddit.com/user/${username}`, found(2)],
        ['YouTube', 'bi-youtube', `https://youtube.com/@${username}`, found(3)],
        ['TikTok', 'bi-tiktok', `https://tiktok.com/@${username}`, found(0)],
        ['Pinterest', 'bi-pinterest', `https://pinterest.com/${username}`, found(1)],
        ['Snapchat', 'bi-snapchat', `https://snapchat.com/add/${username}`, found(2)],
        ['Telegram', 'bi-telegram', `https://t.me/${username}`, found(3)],
        ['Twitch', 'bi-twitch', `https://twitch.tv/${username}`, found(0)],
        ['Facebook', 'bi-facebook', `https://facebook.com/${username}`, found(2)]
    ];
    return `<div class="flex justify-between items-center mb-4"><h3 class="font-semibold text-white">Scan Results for <span class="text-[#7fff00] font-mono">${username}</span></h3><span class="text-xs text-[#94a3b8]">Scanned ${platforms.length} platforms</span></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">${platforms.map(([name, icon, url, isFound]) => `<div class="border rounded-lg p-4 flex items-start gap-4 ${isFound ? 'text-green-400 bg-green-900/30 border-green-800' : 'text-[#94a3b8] bg-[#1f2937]/30 border-white/5'}"><i class="bi ${icon} text-2xl"></i><div><h4 class="font-bold text-white">${name}</h4><div class="font-mono text-sm opacity-80">${isFound ? 'MATCH FOUND' : 'NO MATCH'}</div>${isFound ? `<a href="${url}" target="_blank" class="text-xs text-[#7fff00] hover:underline mt-2 inline-block">View Profile <i class="bi bi-box-arrow-up-right"></i></a>` : '<span class="text-xs text-[#94a3b8]/60 mt-2 inline-block">Not Found</span>'}</div></div>`).join('')}</div>`;
}

function emailResults(email) {
    const domain = email.split('@')[1] || 'unknown.tld';
    return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="glass-panel p-4 border-l-2 border-l-[#7fff00]"><div class="text-xs text-[#94a3b8] uppercase mb-1">Target Email</div><div class="font-mono text-white flex justify-between">${email}<button onclick="copyToClipboard('${email}')"><i class="bi bi-copy"></i></button></div></div><div class="glass-panel p-4"><div class="text-xs text-[#94a3b8] uppercase mb-1">Format</div><div class="text-green-400 font-bold"><i class="bi bi-check-circle"></i> Valid</div></div><div class="glass-panel p-4"><div class="text-xs text-[#94a3b8] uppercase mb-1">Domain</div><div class="font-mono text-white">${domain}</div><div class="text-xs text-[#94a3b8] mt-2">MX: mail.${domain}</div></div><div class="glass-panel p-4 border border-red-900/30"><div class="text-red-400 font-bold mb-2"><i class="bi bi-shield-exclamation"></i> Breach Intel</div><p class="text-sm text-[#94a3b8]">2 mock exposures found: Canva 2019, LinkedIn Collection 2021.</p></div></div>`;
}

async function ipResults(ip) {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    if (data.error) throw new Error(data.reason || 'Invalid IP address');
    return `<div class="flex items-center justify-between border-b border-white/10 pb-4 mb-4"><div><div class="text-[#94a3b8] text-xs uppercase mb-1">Target IP</div><div class="text-2xl font-mono text-[#7fff00]">${data.ip}</div></div><img src="https://flagcdn.com/w40/${data.country_code ? data.country_code.toLowerCase() : 'un'}.png" alt="Flag" class="rounded border border-white/10"></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h4 class="text-white font-semibold mb-3"><i class="bi bi-geo mr-2 text-[#94a3b8]"></i>Geolocation</h4>${kvTable({ City: data.city, Region: data.region, Country: data.country_name, Coordinates: `${data.latitude}, ${data.longitude}` })}</div><div><h4 class="text-white font-semibold mb-3"><i class="bi bi-hdd-network mr-2 text-[#94a3b8]"></i>Network Intel</h4>${kvTable({ ISP: data.org, ASN: data.asn, Timezone: data.timezone })}</div></div>`;
}

function domainResults(domain) {
    const ip = `104.21.${rand(255)}.${rand(255)}`;
    return `<h3 class="text-xl font-mono text-[#7fff00] font-bold mb-4">${domain}</h3><div class="bg-[#0a0a0f] rounded-lg border border-white/5 overflow-hidden mb-4"><table class="result-table"><thead><tr><th>Type</th><th>Value</th><th>TTL</th></tr></thead><tbody><tr><td class="text-[#7fff00]">A</td><td>${ip}</td><td class="text-[#94a3b8]">300</td></tr><tr><td class="text-purple-400">MX</td><td>alt1.aspmx.l.google.com</td><td class="text-[#94a3b8]">3600</td></tr><tr><td class="text-blue-400">TXT</td><td>v=spf1 include:_spf.google.com ~all</td><td class="text-[#94a3b8]">3600</td></tr></tbody></table></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="glass-panel p-4"><div class="text-xs text-[#94a3b8] uppercase mb-1">SSL Certificate</div><div class="font-bold text-white"><i class="bi bi-lock-fill text-green-400 mr-2"></i>Valid & Enforced</div></div><div class="glass-panel p-4"><div class="text-xs text-[#94a3b8] uppercase mb-1">Hosting / WAF</div><div class="font-bold text-white"><i class="bi bi-server text-[#7fff00] mr-2"></i>Cloudflare, Inc.</div></div></div>`;
}

function breachResults(target) {
    const breaches = ['Adobe - Email, Passwords', 'Canva - Email, Names', 'LinkedIn - Job Titles', 'Dropbox - Password Hashes'];
    return `<div class="mb-4 flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-red-900/30 text-red-400 flex items-center justify-center border border-red-800"><i class="bi bi-exclamation-triangle"></i></div><div><div class="text-white font-bold">${breaches.length} Breaches Found</div><div class="text-xs text-[#94a3b8]">Target: <span class="font-mono text-white">${target}</span></div></div></div><div class="space-y-3">${breaches.map((b) => `<div class="glass-panel p-4 border-l-2 border-l-red-500"><div class="font-bold text-white">${b}</div><div class="text-xs text-[#94a3b8] mt-1">Mock breach intelligence for demo use.</div></div>`).join('')}</div>`;
}

function phoneResults(phone) {
    const carriers = ['Verizon Wireless', 'AT&T Mobility', 'T-Mobile USA', 'Vodafone', 'Orange'];
    const index = phone.length % carriers.length;
    return cardGrid({ 'Target Number': phone, 'Line Type': ['Mobile', 'Landline', 'VoIP'][index % 3], Carrier: carriers[index], Location: ['New York, NY', 'Los Angeles, CA', 'London, UK', 'Berlin, DE', 'Toronto, CA'][index], Valid: 'Yes' });
}

function subdomainResults(domain) {
    const subs = ['www', 'mail', 'api', 'dev', 'admin', 'blog', 'cdn', 'staging'].filter((_, i) => (domain.length + i) % 3 !== 0);
    return `<h3 class="font-semibold text-white mb-4">Discovered Subdomains for <span class="text-[#7fff00] font-mono">${domain}</span></h3><div class="bg-[#0a0a0f] rounded-lg border border-white/5 overflow-hidden"><table class="result-table"><thead><tr><th>Subdomain</th><th>IP Address</th><th>Status</th></tr></thead><tbody>${subs.map((sub, i) => `<tr><td class="text-[#7fff00] font-mono">${sub}.${domain}</td><td>192.168.${i + 1}.${rand(255)}</td><td class="text-green-400">200 OK</td></tr>`).join('')}</tbody></table></div>`;
}

function sslResults(domain) {
    return cardGrid({ Domain: domain, Issuer: "Let's Encrypt Authority X3", Subject: `CN = ${domain}`, 'Valid From': '2025-01-15', 'Valid Until': '2025-04-15', SANs: `${domain}, www.${domain}, *.${domain}` });
}

function macResults(mac) {
    const vendors = ['Apple, Inc.', 'Samsung Electronics', 'Cisco Systems, Inc.', 'Huawei Technologies', 'Intel Corporate'];
    const index = mac.length % vendors.length;
    return cardGrid({ 'MAC Address': mac.toUpperCase(), OUI: mac.toUpperCase().split(':').slice(0, 3).join(':'), Vendor: vendors[index], Country: ['United States', 'South Korea', 'United States', 'China', 'United States'][index] });
}

function urlResults(url) {
    const finalUrl = url.includes('bit.ly') || url.includes('t.co') || url.includes('tinyurl') ? 'https://example.com/very/long/hidden/path?ref=track' : url;
    const hops = url.includes('bit.ly') ? 3 : url.includes('t.co') ? 2 : 1;
    return `<div class="space-y-4"><div class="glass-panel p-4 border-l-2 border-l-[#7fff00]"><div class="text-xs text-[#94a3b8] uppercase mb-1">Original URL</div><div class="font-mono text-sm text-white break-all">${url}</div></div><div class="flex items-center gap-2 text-[#94a3b8] px-2"><i class="bi bi-arrow-down"></i><span class="text-xs">${hops} redirect${hops > 1 ? 's' : ''} detected</span></div><div class="glass-panel p-4 border-l-2 border-l-green-500"><div class="text-xs text-[#94a3b8] uppercase mb-1">Final Destination</div><div class="font-mono text-sm text-green-400 break-all flex justify-between gap-2"><span>${finalUrl}</span><button onclick="copyToClipboard('${finalUrl}')"><i class="bi bi-copy"></i></button></div></div></div>`;
}

function loadingHtml() {
    return '<div class="space-y-4"><div class="shimmer h-8 rounded w-1/3"></div><div class="shimmer h-24 rounded w-full"></div><div class="shimmer h-24 rounded w-full"></div></div>';
}

function kvTable(values) {
    return `<table class="w-full text-sm"><tbody class="divide-y divide-white/5">${Object.entries(values).map(([key, value]) => `<tr><td class="py-2 text-[#94a3b8]">${key}</td><td class="py-2 text-white font-medium text-right">${value || 'N/A'}</td></tr>`).join('')}</tbody></table>`;
}

function cardGrid(values) {
    return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${Object.entries(values).map(([key, value]) => `<div class="glass-panel p-4"><div class="text-xs text-[#94a3b8] uppercase mb-1">${key}</div><div class="font-bold text-white break-all">${value}</div></div>`).join('')}</div>`;
}

function activityTable() {
    return `<div class="glass-panel overflow-hidden"><div class="p-5 border-b border-white/5 flex justify-between items-center"><h3 class="font-semibold text-white">Recent Activity List</h3><button class="text-xs text-[#7fff00] hover:underline" onclick="clearData()">Clear History</button></div><table class="w-full text-left text-sm"><thead class="text-xs text-[#94a3b8] uppercase bg-[#1f2937]/30 border-b border-white/5"><tr><th class="px-5 py-3 font-medium">Target</th><th class="px-5 py-3 font-medium">Type</th><th class="px-5 py-3 font-medium">Status</th><th class="px-5 py-3 font-medium">Timestamp</th></tr></thead><tbody id="recent-activity-table" class="divide-y divide-white/5">${activity.map(rowHtml).join('')}</tbody></table></div>`;
}

function rowHtml(item) {
    return `<tr class="hover:bg-[#1f2937]/20 transition"><td class="px-5 py-3 font-mono text-white">${item.target}</td><td class="px-5 py-3 text-[#94a3b8]">${item.type}</td><td class="px-5 py-3"><span class="${item.badge}">${item.status}</span></td><td class="px-5 py-3 text-[#94a3b8]">${item.time}</td></tr>`;
}

function addActivity(target, type, badge, status) {
    activity.unshift({ target, type, badge, status, time: 'Just now' });
    if (activity.length > 6) activity.pop();
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const color = type === 'error' ? 'border-red-500 bg-red-900/90' : type === 'info' ? 'border-blue-500/50 bg-[#1f2937]' : 'border-[#7fff00]/50 bg-[#1f2937]';
    const icon = type === 'error' ? 'bi-exclamation-triangle-fill text-red-400' : type === 'info' ? 'bi-info-circle-fill text-blue-400' : 'bi-check-circle-fill text-[#7fff00]';
    toast.className = `flex items-center p-4 text-white ${color} border rounded-lg shadow-lg fade-in backdrop-blur-md`;
    toast.innerHTML = `<i class="bi ${icon} text-xl mr-3"></i><div class="text-sm font-medium">${message}</div>`;
    document.getElementById('toast-container').appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard')).catch(() => showToast('Failed to copy', 'error'));
}

function clearData() {
    activity.length = 0;
    showToast('Local activity cleared');
    renderDashboard();
}

function sanitizeTarget(value) {
    return value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
}

function shortLabel(title) {
    return title.replace(' Intelligence', '').replace(' Scanner', '').replace(' Analyzer', '').replace(' Address', '').replace(' Monitor', '');
}

function rand(max) {
    return Math.floor(Math.random() * max);
}