import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import cors from 'cors';
  const app = express();
  app.use(cors()); //hii itatibu ile Error 404 ya kukata data.

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple JSON Database setup
const DB_PATH = path.join(process.cwd(), 'db.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_PATH)) {
  const initialData = {
    indicators: [
      { id: '185_156_177_214', value: '185.156.177.214', type: 'ip', source: 'Emerging Threats', description: 'Known C2 server', severity: 'high', confidence: 92, lastSeen: new Date().toISOString(), tags: ['osint', 'ip'], analysis: 'This IP address is associated with a known Command and Control (C2) server. Mitigation: Block all inbound and outbound traffic to this IP at the perimeter firewall.' },
      { id: 'secure-login-bank_xyz', value: 'secure-login-bank.xyz', type: 'domain', source: 'OpenPhish', description: 'Phishing domain targeting banking users', severity: 'critical', confidence: 98, lastSeen: new Date().toISOString(), tags: ['osint', 'domain'], analysis: 'Active phishing site spoofing major financial institutions. Mitigation: Blacklist this domain in DNS and web proxy filters immediately.' }
    ]
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
}

function getDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { indicators: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    if (!data.trim()) return { indicators: [] };
    return JSON.parse(data);
  } catch (error) {
    console.error('[DB_READ_ERROR]:', error);
    return { indicators: [] };
  }
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('[DB_WRITE_ERROR]:', error);
  }
}

// --- Advanced Normalization & Scoring Constants ---
const SOURCE_REPUTATION: Record<string, number> = {
  'Emerging Threats': 9,
  'OpenPhish': 8,
  'URLHaus': 9,
  'Manual Entry': 5,
  'Abuse.ch': 10,
  'AlienVault OTX': 7,
  'VirusTotal': 9,
};

const TYPE_WEIGHTS: Record<string, number> = {
  'email': 0.4,
  'url': 0.6,
  'domain': 0.8,
  'ip': 0.9,
  'hash': 1.0,
};

function normalizeIndicator(raw: any): any {
  // Common Schema Mapping
  const type = (raw.type || raw.kind || 'ip').toLowerCase();
  const source = raw.source || raw.provider || 'Unknown';
  const confidence = raw.confidence || raw.trust || 50;
  
  // Normalize Severity
  let severity = (raw.severity || raw.level || 'low').toLowerCase();
  if (!['low', 'medium', 'high', 'critical'].includes(severity)) {
    severity = 'medium';
  }

  // Standardization
  return {
    value: String(raw.value || raw.address || raw.hash || '').trim(),
    type,
    source,
    severity,
    confidence: Math.min(100, Math.max(0, confidence)),
    description: raw.description || raw.msg || 'Automatic normalization mapping applied.',
    activityCount: raw.count || Math.floor(Math.random() * 10) + 1,
    exploitability: raw.exploitability || (severity === 'critical' ? 9 : 4),
  };
}

function calculateRiskScore(indicator: any): number {
  const reputation = SOURCE_REPUTATION[indicator.source] || 5;
  const typeWeight = TYPE_WEIGHTS[indicator.type] || 0.5;
  const confidenceFactor = indicator.confidence / 100;
  const activityBonus = Math.min(10, indicator.activityCount) / 10;
  const exploitabilityFactor = indicator.exploitability / 10;

  // Algorithm: (Reputation * TypeWeight * Confidence * 70) + (Exploitability * 20) + (Activity * 10)
  const score = (reputation * typeWeight * confidenceFactor * 7) + 
                (exploitabilityFactor * 20) + 
                (activityBonus * 10);
                
  return Math.min(100, Math.round(score));
}

async function startServer() {
  const app = express();
  const PORT = 10000;

  app.use(cors());
  
  // Middleware: Request Logger
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'N/A'} - Host: ${req.headers.host}`);
    // Add custom headers for diagnostics
    res.setHeader('X-TIP-Status', 'Active');
    next();
  });

  app.use(express.json());

  // API: Health & Diagnostic Check
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // API: Trigger Feed Sync
  app.get('/api/sync', async (req, res) => {
    try {
      console.log('Starting REAL threat feed sync from OSINT sources...');
      
      const feeds = [
        { url: 'https://urlhaus-api.abuse.ch/v1/urls/recent/', name: 'URLHaus', type: 'url' },
        { url: 'https://openphish.com/feed.txt', name: 'OpenPhish', type: 'url' },
        { url: 'https://threatfox-api.abuse.ch/api/v1/', name: 'ThreatFox', type: 'multi' }
      ];

      const osintConfig = {
        timeout: 10000,
        headers: {
          'User-Agent': 'TIP-OSINT-Bot/2.5.0 (Security-Intelligence-Platform)',
          'Accept': 'application/json'
        }
      };

      const allFetchedIOCs: any[] = [];

      // 1. Fetch from URLHaus (JSON API)
      try {
        const urlhausRes = await axios.get(feeds[0].url, osintConfig);
        if (urlhausRes.data && urlhausRes.data.urls) {
          urlhausRes.data.urls.slice(0, 50).forEach((item: any) => {
            allFetchedIOCs.push({
              value: item.url,
              type: 'url',
              source: 'URLHaus',
              description: `Malware URL: ${item.threat}`,
              severity: 'high',
              confidence: 90
            });
          });
        }
      } catch (e: any) { 
        console.error(`[OSINT_ERROR] URLHaus fetch failed: ${e.message}`); 
      }

      // 2. Fetch from OpenPhish (Plain Text)
      try {
        const openPhishRes = await axios.get(feeds[1].url, { ...osintConfig, responseType: 'text' });
        const lines = openPhishRes.data.split('\n').slice(0, 50);
        lines.forEach((line: string) => {
          if (line.trim()) {
            allFetchedIOCs.push({
              value: line.trim(),
              type: 'url',
              source: 'OpenPhish',
              description: 'Active phishing URL detected by OpenPhish community.',
              severity: 'critical',
              confidence: 95
            });
          }
        });
      } catch (e: any) { 
        console.error(`[OSINT_ERROR] OpenPhish fetch failed: ${e.message}`); 
      }

      // 3. Fetch from ThreatFox (Complex JSON API)
      try {
        const threatfoxRes = await axios.post(feeds[2].url, {
          query: "get_iocs",
          days: 1
        }, osintConfig);
        
        if (threatfoxRes.data && threatfoxRes.data.data) {
          threatfoxRes.data.data.slice(0, 50).forEach((item: any) => {
            allFetchedIOCs.push({
              value: item.ioc_value,
              type: item.ioc_type.includes('ip') ? 'ip' : (item.ioc_type.includes('domain') ? 'domain' : 'url'),
              source: 'ThreatFox',
              description: `Malware family: ${item.malware_printable || 'Unknown'}`,
              severity: 'high',
              confidence: item.confidence_level || 75
            });
          });
        } else {
          console.warn('[OSINT_WARN] ThreatFox returned empty or invalid data');
        }
      } catch (e: any) { 
        console.error(`[OSINT_ERROR] ThreatFox fetch failed: ${e.message}`); 
      }

      // 4. Fetch from Feodo Tracker (C2 IP Blacklist)
      try {
        const feodoRes = await axios.get('https://feodotracker.abuse.ch/downloads/ipblocklist.json', osintConfig);
        if (Array.isArray(feodoRes.data)) {
          feodoRes.data.slice(0, 50).forEach((item: any) => {
            allFetchedIOCs.push({
              value: item.ip_address,
              type: 'ip',
              source: 'Feodo Tracker',
              description: `C2 Server for ${item.malware || 'Feodo'}`,
              severity: 'critical',
              confidence: 100
            });
          });
        }
      } catch (e: any) { 
        console.error(`[OSINT_ERROR] Feodo Tracker fetch failed: ${e.message}`); 
      }

      // 5. Fallback/Seed Data if external fails
      if (allFetchedIOCs.length === 0) {
        allFetchedIOCs.push(
          { value: '185.156.177.214', type: 'ip', source: 'Emerging Threats', description: 'Known C2 server', severity: 'high' },
          { value: 'secure-login-bank.xyz', type: 'domain', source: 'OpenPhish', description: 'Phishing domain targeting banking users', severity: 'critical' }
        );
      }

      const db = getDb();
      const updatedIndicators = Array.isArray(db.indicators) ? [...db.indicators] : [];
      const newlyAdded: string[] = [];

      for (const rawIoc of allFetchedIOCs) {
        try {
          const ioc = normalizeIndicator(rawIoc);
          const existingIndex = updatedIndicators.findIndex((item: any) => item.value === ioc.value);
          
          if (existingIndex === -1) {
              const riskScore = calculateRiskScore(ioc);

              const newEntry = {
                  ...ioc,
                  id: ioc.value.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').substring(0, 100),
                  analysis: '', // Will be enriched by frontend
                  riskScore,
                  sourceReputation: SOURCE_REPUTATION[ioc.source] || 5,
                  lastSeen: new Date().toISOString(),
                  normalizedAt: new Date().toISOString(),
                  isDuplicate: false,
                  tags: ['osint', ioc.type, ioc.source.toLowerCase().replace(/\s+/g, '_')]
              };
              updatedIndicators.push(newEntry);
              newlyAdded.push(ioc.value);
          } else {
              updatedIndicators[existingIndex].lastSeen = new Date().toISOString();
              updatedIndicators[existingIndex].activityCount++;
              updatedIndicators[existingIndex].riskScore = calculateRiskScore(updatedIndicators[existingIndex]);
          }
        } catch (iocError) {
          console.error(`Error processing raw IOC:`, iocError);
        }
      }

      db.indicators = updatedIndicators;
      saveDb(db);

      res.json({ success: true, count: newlyAdded.length, synced: newlyAdded });
    } catch (error) {
      console.error('Sync error:', error);
      res.status(500).json({ error: 'Failed to sync feeds' });
    }
  });

  // API: Update Indicator (Partial)
  app.patch('/api/indicators/:id', (req, res) => {
    try {
      const { id } = req.params;
      console.log(`[PATCH] Updating indicator: ${id}`);
      const updates = req.body;
      const db = getDb();
      const index = db.indicators.findIndex((ind: any) => ind.id === id);

      if (index !== -1) {
        db.indicators[index] = { ...db.indicators[index], ...updates };
        saveDb(db);
        res.status(200).json(db.indicators[index]);
      } else {
        console.warn(`[PATCH_WARN] Indicator not found: ${id}`);
        res.status(404).json({ error: 'Indicator not found' });
      }
    } catch (error) {
      console.error('[PATCH_ERROR]:', error);
      res.status(500).json({ error: 'Failed to update' });
    }
  });

  // API: Get Indicators
  app.get('/api/indicators', (req, res) => {
    try {
      console.log('[GET] Fetching indicators...');
      const db = getDb();
      const rawIndicators = Array.isArray(db.indicators) ? db.indicators : [];
      // Sort by riskScore descending (Prioritization)
      const indicators = [...rawIndicators].sort((a: any, b: any) => {
        const scoreA = a.riskScore || 0;
        const scoreB = b.riskScore || 0;
        return scoreB - scoreA;
      });
      console.log(`[GET_SUCCESS] Returning ${indicators.length} indicators`);
      res.status(200).json(indicators.slice(0, 50));
    } catch (error) {
      console.error('[INDICATORS_ERROR]:', error);
      res.status(200).json([]); // Return empty array on error for frontend safety
    }
  });

  // Health & Diagnostic Check (Legacy - Removed in favor of top-level health check)

  // API: Get Stats
  app.get('/api/stats', (req, res) => {
    try {
      console.log('[GET] Calculating stats...');
      const db = getDb();
      const indicators = Array.isArray(db.indicators) ? db.indicators : [];
      
      const stats = {
        total: indicators.length,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        byType: {} as Record<string, number>,
        avgRiskScore: 0
      };

      let totalRisk = 0;
      indicators.forEach((data: any) => {
        if (!data) return;
        const sev = String(data.severity || 'low').toLowerCase();
        if (sev in stats) {
          (stats as any)[sev]++;
        } else {
          stats.low++;
        }
        
        if (data.type) {
          stats.byType[data.type] = (stats.byType[data.type] || 0) + 1;
        }

        totalRisk += (data.riskScore || 0);
      });

      stats.avgRiskScore = indicators.length > 0 ? Math.round(totalRisk / indicators.length) : 0;

      console.log(`[GET_SUCCESS] Stats: ${stats.total} total indicators`);
      res.status(200).json(stats);
    } catch (error) {
      console.error('[STATS_ERROR]:', error);
      // Fail gracefully with empty stats instead of 500
      res.status(200).json({ 
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        byType: {},
        error: true
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false, // Explicitly disable HMR to prevent port 24678 usage
        watch: {
          usePolling: true,
          interval: 100,
        }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const backendUrl = 'https://tip-backend-xyz.onrender.com';

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Backend URL: ${backendUrl}`);
  }).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please wait for the system to clear it or try restarting the dev server.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer();
