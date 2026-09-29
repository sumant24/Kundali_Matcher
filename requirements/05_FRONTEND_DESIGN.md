# Frontend Design — React (Light, Professional Theme)

## 1. Visual Direction

A calm, editorial "certificate/report" feel rather than a flashy consumer app — appropriate for a document that carries real personal and astrological data.

- **Palette:** off-white background (`#FAFAF7`), deep navy accents (`#1F3A5F`), a single warm gold accent (`#9A6A1E`) for section dividers and the score gauge — echoes the biodata document you already have.
- **Typography:** a serif display font (e.g. "Merriweather" or "Playfair Display") for headings, a clean sans-serif (e.g. "Inter" or "Source Sans 3") for body text and form fields.
- **Layout:** centered content column, max-width ~900px, generous whitespace, card-based sections with subtle borders/shadows — not filled blocks of color.
- **Library:** MUI (Material UI) with a custom light theme (see `theme.js` below), or Tailwind if you prefer utility classes — either works with this structure.

## 2. MUI Theme Skeleton

```javascript
// src/theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#FAFAF7', paper: '#FFFFFF' },
    primary: { main: '#1F3A5F' },      // navy
    secondary: { main: '#9A6A1E' },    // gold accent
    text: { primary: '#222222', secondary: '#5A5A5A' },
  },
  typography: {
    fontFamily: '"Inter", "Source Sans 3", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: {
      styleOverrides: { root: { boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #E5E2DA' } }
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } }
    }
  }
});
```

## 3. Pages & Components

| Page | Purpose | Key components |
|---|---|---|
| `BiodataPage` | Landing page — displays your full biodata read-only, mirrors the sections from your Word biodata (Personal, Education, Family, Astrological, Contact) | `BiodataCard` (one per section), a prominent "Match Biodata" `Button` |
| `MatchFormPage` | Form to enter the partner's Rashi, Nakshatra, Charan, Lagna, Mars-house placements, optional notes | MUI `TextField`/`Select` per field, client-side validation before submit |
| `MatchResultPage` | Shows the 8-koot breakdown, total score, dosha flags, interpretation | `KootScoreTable`, `ScoreGauge`, `DoshaBadge` (red/amber/green) |
| `HistoryPage` | Lists past match requests (from `GET /api/matches`), click through to re-view any past result | MUI `Table` or list of `Card`s |

### Component sketches

```jsx
// src/components/KootScoreTable.jsx
export default function KootScoreTable({ kootScores }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Koot</TableCell>
          <TableCell align="right">Score</TableCell>
          <TableCell align="right">Max</TableCell>
          <TableCell>Detail</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(kootScores).map(([name, data]) => (
          <TableRow key={name}>
            <TableCell sx={{ textTransform: 'capitalize' }}>{name.replace('_', ' ')}</TableCell>
            <TableCell align="right">{data.score}</TableCell>
            <TableCell align="right">{data.max}</TableCell>
            <TableCell>{data.detail}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

```jsx
// src/components/ScoreGauge.jsx — simple visual (0-36) using a horizontal bar
export default function ScoreGauge({ score, max = 36 }) {
  const pct = Math.round((score / max) * 100);
  return (
    <Box>
      <Typography variant="h4" color="primary">{score} / {max}</Typography>
      <LinearProgress variant="determinate" value={pct} sx={{ height: 10, borderRadius: 5 }} />
    </Box>
  );
}
```

## 4. API Client

```javascript
// src/api/client.js
import axios from 'axios';

const client = axios.create({ baseURL: 'http://localhost:5000/api' });

export const getBiodata = () => client.get('/biodata').then(r => r.data);
export const postMatch = (payload) => client.post('/match', payload).then(r => r.data);
export const getMatches = () => client.get('/matches').then(r => r.data);
export const getMatchById = (id) => client.get(`/matches/${id}`).then(r => r.data);
```

## 5. Navigation

Simple client-side routing with `react-router-dom`:

```
/               → BiodataPage
/match          → MatchFormPage
/match/result/:matchId → MatchResultPage
/history        → HistoryPage
```
