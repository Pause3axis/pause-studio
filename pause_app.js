import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, SafeAreaView,
  Clipboard, Alert, StatusBar
} from 'react-native';

// ══════════════════════════════════════════
// KNOWLEDGE BASE
// ══════════════════════════════════════════
const KB = {
  instruments: {
    'bass':     { dark:'[bass: sustained root notes, deep sub, slow movement, mono]', melancholic:'[bass: slow walking, warm tone, melodic movement]', neutral:'[bass: groove locked to kick, medium attack]', tense:'[bass: rhythmic staccato, sharp attack, sub pressure]', uplifting:'[bass: walking melodic, forward motion]', euphoric:'[bass: full sub, active movement, maximum pressure]', ethereal:'[bass: sub only, sustained root, minimal]' },
    'drums':    { dark:'[drums: sparse minimal hits, no fills, wide spacing]', melancholic:'[drums: brush light, soft attack, sparse]', neutral:'[drums: tight groove, no fills, locked in]', tense:'[drums: sharp transients, building tension]', uplifting:'[drums: full groove with fills, driving]', euphoric:'[drums: full groove maximum energy, peak intensity]', ethereal:'[drums: no drums]' },
    'pad':      { dark:'[pad: slow attack, dark texture, wide, low register]', melancholic:'[pad: slow attack, warm filter, sustained chord]', neutral:'[pad: medium attack, neutral tone, background]', tense:'[pad: dissonant texture, high register, tension held]', uplifting:'[pad: bright tone, slow attack, wide stereo]', euphoric:'[pad: full bright chord, wide, high energy]', ethereal:'[pad: very slow attack, high register, spacious]' },
    'piano':    { dark:'[piano: sparse single notes, low register, wide gaps]', melancholic:'[piano: sparse chords, soft attack, breathing phrasing]', neutral:'[piano: chord clusters, medium attack, balanced]', tense:'[piano: staccato notes, tight attack, no sustain]', uplifting:'[piano: arpeggios ascending, bright, forward motion]', euphoric:'[piano: full voicing, strong attack, driving rhythm]', ethereal:'[piano: single notes high register, soft attack, sparse]' },
    'strings':  { dark:'[strings: sustained chords, dark tone, slow bow]', melancholic:'[strings: sustained chords, arco slow, emotional]', neutral:'[strings: sustained chords, arco medium, balanced]', tense:'[strings: tremolo, high register, dissonance]', uplifting:'[strings: arco medium, ascending phrases]', euphoric:'[strings: full orchestra, fast bow, high energy]', ethereal:'[strings: slow bow, high register, sustained harmonics]' },
    'synthesizer':{ dark:'[synthesizer: sustained drone, dark texture, slow movement]', melancholic:'[synthesizer: texture layer, warm filter, slow modulation]', neutral:'[synthesizer: rhythmic sequences, medium attack]', tense:'[synthesizer: stabs rhythmic, sharp attack, dissonant]', uplifting:'[synthesizer: lead melody, bright tone, forward]', euphoric:'[synthesizer: lead melody full, high energy, wide stereo]', ethereal:'[synthesizer: pad-like drone, very slow attack, spacious]' },
    'acoustic guitar':{ dark:'[acoustic guitar: sparse single notes, low register, no brightness]', melancholic:'[acoustic guitar: fingerpicking sparse, soft attack, wide gaps]', neutral:'[acoustic guitar: fingerpicking medium, balanced, steady]', tense:'[acoustic guitar: muted picking, rhythmic, tight attack]', uplifting:'[acoustic guitar: arpeggios medium, bright, forward]', euphoric:'[acoustic guitar: strumming driving, full chord, energetic]', ethereal:'[acoustic guitar: single notes sparse, high register, reverb]' },
    'electric guitar':{ dark:'[electric guitar: clean single notes, dark tone, slow phrases]', melancholic:'[electric guitar: clean arpeggios, warm tone, slow attack]', neutral:'[electric guitar: clean chord stabs, medium attack]', tense:'[electric guitar: muted rhythmic, tight, no sustain]', uplifting:'[electric guitar: clean lead, forward phrases]', euphoric:'[electric guitar: distorted riffs, full attack, driving]', ethereal:'[electric guitar: clean harmonics, high register, long decay]' },
    'voice':    { dark:'[voice: spoken whisper, dark tone, sparse]', melancholic:'[voice: breathy tone, slow phrases, intimate]', neutral:'[voice: balanced tone, medium phrases, clear]', tense:'[voice: spoken tight, no vibrato, tense]', uplifting:'[voice: warm tone, ascending phrases]', euphoric:'[voice: full tone, high energy, wide range]', ethereal:'[voice: whisper high register, very sparse, breathy]' },
  },
  harmony: {
    'D minor':  { static:'Dm', slow:'Dm — C — Bb', medium:'Dm — Gm — Bb — A', active:'Dm — C — Bb — A7 — Dm' },
    'A minor':  { static:'Am', slow:'Am — G — F', medium:'Am — Em — F — G', active:'Am — G — F — E7 — Am' },
    'E minor':  { static:'Em', slow:'Em — D — C', medium:'Em — Bm — C — D', active:'Em — D — C — B7 — Em' },
    'G minor':  { static:'Gm', slow:'Gm — F — Eb', medium:'Gm — Dm — Eb — F', active:'Gm — F — Eb — D7 — Gm' },
    'C minor':  { static:'Cm', slow:'Cm — Bb — Ab', medium:'Cm — Gm — Ab — Bb', active:'Cm — Bb — Ab — G7 — Cm' },
    'D major':  { static:'D', slow:'D — A — Bm', medium:'D — Bm — G — A', active:'D — A — Bm — G — D' },
    'C major':  { static:'C', slow:'C — G — Am', medium:'C — Am — F — G', active:'C — G — Am — F — C' },
  },
  dynamic: { 1:'pp', 2:'p', 3:'mp', 4:'mf', 5:'f' },
  genres: {
    dnb:      { name:'DRUM & BASS', bpm:174, key:'A minor', secs:[{n:'INTRO',e:1,d:1,m:'dark',h:'slow',bars:16,inst:['pad']},{n:'VERSE',e:3,d:3,m:'dark',h:'medium',bars:32,inst:['bass','drums']},{n:'CHORUS',e:5,d:5,m:'dark',h:'medium',bars:32,inst:['bass','drums','pad']},{n:'BREAK',e:1,d:1,m:'tense',h:'static',bars:16,inst:['pad']},{n:'OUTRO',e:2,d:2,m:'dark',h:'slow',bars:16,inst:['bass','pad']}]},
    neurofunk:{ name:'NEUROFUNK', bpm:174, key:'A minor', secs:[{n:'INTRO',e:1,d:1,m:'dark',h:'static',bars:8,inst:['pad']},{n:'VERSE',e:4,d:4,m:'dark',h:'medium',bars:32,inst:['bass','drums']},{n:'CHORUS',e:5,d:5,m:'tense',h:'active',bars:32,inst:['bass','drums','synthesizer']},{n:'BREAK',e:1,d:2,m:'dark',h:'static',bars:16,inst:['synthesizer']},{n:'OUTRO',e:1,d:1,m:'dark',h:'static',bars:16,inst:['bass']}]},
    liquid:   { name:'LIQUID DnB', bpm:174, key:'D minor', secs:[{n:'INTRO',e:1,d:1,m:'melancholic',h:'slow',bars:16,inst:['pad','piano']},{n:'VERSE',e:3,d:3,m:'melancholic',h:'medium',bars:32,inst:['bass','drums']},{n:'CHORUS',e:4,d:4,m:'uplifting',h:'medium',bars:32,inst:['bass','drums','strings']},{n:'BREAK',e:2,d:2,m:'melancholic',h:'slow',bars:32,inst:['piano','pad']},{n:'OUTRO',e:2,d:2,m:'melancholic',h:'slow',bars:16,inst:['pad','bass']}]},
    lofi:     { name:'LO-FI', bpm:85, key:'D minor', secs:[{n:'INTRO',e:1,d:1,m:'melancholic',h:'slow',bars:8,inst:['piano']},{n:'VERSE',e:2,d:2,m:'melancholic',h:'medium',bars:32,inst:['piano','drums','bass']},{n:'CHORUS',e:3,d:3,m:'melancholic',h:'medium',bars:16,inst:['piano','drums','bass']},{n:'OUTRO',e:1,d:1,m:'melancholic',h:'slow',bars:8,inst:['piano']}]},
    ambient:  { name:'AMBIENT', bpm:70, key:'E minor', secs:[{n:'INTRO',e:1,d:1,m:'ethereal',h:'static',bars:16,inst:['pad']},{n:'VERSE',e:2,d:2,m:'ethereal',h:'slow',bars:64,inst:['pad','synthesizer']},{n:'OUTRO',e:1,d:1,m:'ethereal',h:'static',bars:16,inst:['pad']}]},
    piano:    { name:'SOLO PIANO', bpm:63, key:'D minor', secs:[{n:'INTRO',e:1,d:1,m:'melancholic',h:'slow',bars:8,inst:['piano']},{n:'VERSE',e:2,d:2,m:'melancholic',h:'medium',bars:16,inst:['piano']},{n:'CHORUS',e:3,d:3,m:'melancholic',h:'medium',bars:16,inst:['piano']},{n:'OUTRO',e:1,d:1,m:'melancholic',h:'slow',bars:8,inst:['piano']}]},
  },
};

const ALL_INSTS = ['bass','drums','pad','piano','strings','synthesizer','acoustic guitar','electric guitar','voice'];
const MOODS = ['dark','melancholic','neutral','tense','uplifting','euphoric','ethereal'];
const HARMONIES = ['static','slow','medium','active'];
const BARS_OPTIONS = [8,16,32,64];
const SEC_COLORS = { INTRO:'#18c868', VERSE:'#2060e0', CHORUS:'#c83030', BRIDGE:'#d88020', BREAK:'#10b0c8', OUTRO:'#7030c8' };
const KEYS = ['D minor','A minor','E minor','G minor','C minor','B minor','C major','G major','D major'];

// ══════════════════════════════════════════
// OFFLINE PROMPT BUILDER
// ══════════════════════════════════════════
function buildPrompt(sections, bpm, key) {
  const chords = KB.harmony[key] || KB.harmony['D minor'];
  const instAll = [...new Set(sections.flatMap(s => s.instruments))];

  const style = [
    `${bpm} BPM`, key,
    'no vocals', 'no singing', 'instrumental only',
    instAll.join(', '),
    sections[0]?.mood || 'melancholic',
    'controlled structure', 'no randomness', 'professional mix',
  ].join(', ').slice(0, 1000);

  let ctrl = '[INSTRUMENTAL ONLY]\n[NO VOCALS]\n[NO SINGING]\n\n';

  sections.forEach(sec => {
    ctrl += `[${sec.name}]\n`;
    sec.instruments.forEach(inst => {
      const beh = sec.behaviors?.[inst]?.trim();
      if (beh) {
        ctrl += `[${inst}: ${beh}]\n`;
      } else {
        const line = KB.instruments[inst]?.[sec.mood] || `[${inst}: ${sec.mood} character]`;
        ctrl += line + '\n';
      }
    });
    const harmChords = chords[sec.harmony] || chords.medium;
    ctrl += `[harmony: ${harmChords}]\n`;
    ctrl += `[dynamic: ${KB.dynamic[sec.energy] || 'mp'}]\n\n`;
  });

  return { style, ctrl: ctrl.trim() };
}

// ══════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('home'); // home | build | output
  const [bpm, setBpm] = useState('174');
  const [key, setKey] = useState('D minor');
  const [sections, setSections] = useState([]);
  const [expandedSec, setExpandedSec] = useState(null);
  const [output, setOutput] = useState(null);
  const [step, setStep] = useState(1); // guide step
  const [activeTemplate, setActiveTemplate] = useState(null);

  // Apply genre template
  const applyGenre = useCallback((gid) => {
    const tmpl = KB.genres[gid];
    if (!tmpl) return;
    setBpm(String(tmpl.bpm));
    setKey(tmpl.key);
    setActiveTemplate(gid);
    const newSecs = tmpl.secs.map(s => ({
      name: s.n, energy: s.e, density: s.d, mood: s.m,
      harmony: s.h, bars: s.bars,
      instruments: s.inst.slice(0, 3),
      behaviors: {},
    }));
    setSections(newSecs);
    setStep(2);
    setScreen('build');
  }, []);

  // Toggle instrument in section
  const toggleInst = useCallback((secIdx, inst) => {
    setSections(prev => {
      const next = [...prev];
      const sec = { ...next[secIdx] };
      if (sec.instruments.includes(inst)) {
        sec.instruments = sec.instruments.filter(i => i !== inst);
        const b = { ...sec.behaviors };
        delete b[inst];
        sec.behaviors = b;
      } else {
        if (sec.instruments.length >= 3) {
          Alert.alert('Max 3 instruments per section');
          return prev;
        }
        sec.instruments = [...sec.instruments, inst];
      }
      next[secIdx] = sec;
      if (sec.instruments.length > 0 && step < 3) setStep(3);
      return next;
    });
  }, [step]);

  // Update behavior text
  const updateBeh = useCallback((secIdx, inst, text) => {
    setSections(prev => {
      const next = [...prev];
      next[secIdx] = {
        ...next[secIdx],
        behaviors: { ...next[secIdx].behaviors, [inst]: text }
      };
      return next;
    });
  }, []);

  // Update section param
  const updateSec = useCallback((secIdx, field, value) => {
    setSections(prev => {
      const next = [...prev];
      next[secIdx] = { ...next[secIdx], [field]: value };
      return next;
    });
  }, []);

  // Add section
  const addSection = useCallback((name) => {
    setSections(prev => [...prev, {
      name, energy: 3, density: 2, mood: 'melancholic',
      harmony: 'medium', bars: 16, instruments: [], behaviors: {}
    }]);
    if (step < 2) setStep(2);
  }, [step]);

  // Delete section
  const delSection = useCallback((idx) => {
    setSections(prev => prev.filter((_, i) => i !== idx));
  }, []);

  // Generate
  const generate = useCallback(() => {
    if (!sections.length) { Alert.alert('Add sections first'); return; }
    if (sections.some(s => !s.instruments.length)) {
      Alert.alert('Each section needs at least one instrument');
      return;
    }
    const result = buildPrompt(sections, bpm, key);
    setOutput(result);
    setScreen('output');
    setStep(4);
  }, [sections, bpm, key]);

  // Copy
  const copyText = useCallback((text, label) => {
    Clipboard.setString(text);
    Alert.alert(`${label} copied!`);
  }, []);

  // ── SCREENS ──
  if (screen === 'home') {
    return <HomeScreen onSelect={applyGenre} />;
  }

  if (screen === 'output') {
    return (
      <OutputScreen
        output={output}
        onCopy={copyText}
        onBack={() => setScreen('build')}
        onNew={() => { setSections([]); setOutput(null); setStep(1); setScreen('home'); }}
      />
    );
  }

  // BUILD SCREEN
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#10131a" />

      {/* HEADER */}
      <View style={s.hdr}>
        <TouchableOpacity onPress={() => setScreen('home')} style={s.backBtn}>
          <Text style={s.backTxt}>← BACK</Text>
        </TouchableOpacity>
        <View style={s.hdrCenter}>
          <Text style={s.hdrBpm}>
            {bpm} BPM · {key}
          </Text>
        </View>
        <TouchableOpacity onPress={generate} style={s.genBtn}>
          <Text style={s.genTxt}>GENERATE</Text>
        </TouchableOpacity>
      </View>

      {/* GUIDE BAR */}
      <View style={s.guideBar}>
        {[
          { n: 1, label: 'TEMPLATE' },
          { n: 2, label: 'SECTIONS' },
          { n: 3, label: 'INSTRUMENTS' },
          { n: 4, label: 'GENERATE' },
        ].map((gs, i) => (
          <React.Fragment key={gs.n}>
            <View style={s.gsItem}>
              <View style={[s.gsNum, step > gs.n && s.gsNumDone, step === gs.n && s.gsNumActive]}>
                <Text style={[s.gsNumTxt, (step >= gs.n) && s.gsNumTxtActive]}>
                  {step > gs.n ? '✓' : gs.n}
                </Text>
              </View>
              <Text style={[s.gsLabel, step === gs.n && s.gsLabelActive, step > gs.n && s.gsLabelDone]}>
                {gs.label}
              </Text>
            </View>
            {i < 3 && <Text style={s.gsArrow}>›</Text>}
          </React.Fragment>
        ))}
      </View>

      <ScrollView style={s.scroll} keyboardShouldPersistTaps="handled">

        {/* GLOBAL PARAMS */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>GLOBAL PARAMETERS</Text>
          <View style={s.paramRow}>
            <Text style={s.paramLabel}>BPM</Text>
            <TextInput
              style={s.paramInput}
              value={bpm}
              onChangeText={setBpm}
              keyboardType="number-pad"
              placeholderTextColor="#3a4a5e"
            />
          </View>
          <Text style={s.paramLabel} >KEY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipRow}>
            {KEYS.map(k => (
              <TouchableOpacity
                key={k}
                style={[s.chip, key === k && s.chipOn]}
                onPress={() => setKey(k)}
              >
                <Text style={[s.chipTxt, key === k && s.chipTxtOn]}>{k}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ADD SECTIONS */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>ADD SECTION</Text>
          <View style={s.secTypesGrid}>
            {['INTRO','VERSE','CHORUS','BRIDGE','BREAK','OUTRO'].map(name => (
              <TouchableOpacity
                key={name}
                style={[s.secTypeBtn, { borderColor: SEC_COLORS[name] + '55' }]}
                onPress={() => addSection(name)}
              >
                <Text style={[s.secTypeTxt, { color: SEC_COLORS[name] }]}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SECTIONS */}
        {sections.map((sec, idx) => (
          <SectionCard
            key={idx}
            sec={sec}
            idx={idx}
            expanded={expandedSec === idx}
            onToggle={() => setExpandedSec(expandedSec === idx ? null : idx)}
            onUpdate={(field, val) => updateSec(idx, field, val)}
            onToggleInst={(inst) => toggleInst(idx, inst)}
            onUpdateBeh={(inst, text) => updateBeh(idx, inst, text)}
            onDelete={() => delSection(idx)}
          />
        ))}

        {sections.length === 0 && (
          <View style={s.emptyState}>
            <Text style={s.emptyTxt}>Tap a section type above to add it</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════
// HOME SCREEN
// ══════════════════════════════════════════
function HomeScreen({ onSelect }) {
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#10131a" />
      <View style={s.homeHdr}>
        <Text style={s.logo}>PAUSE</Text>
        <Text style={s.logoSub}>STUDIO</Text>
      </View>
      <Text style={s.homeHint}>Choose a genre template to start</Text>
      <ScrollView style={s.scroll}>
        <View style={s.tmplGrid}>
          {Object.entries(KB.genres).map(([id, tmpl]) => (
            <TouchableOpacity
              key={id}
              style={s.tmplCard}
              onPress={() => onSelect(id)}
              activeOpacity={0.7}
            >
              <Text style={s.tmplName}>{tmpl.name}</Text>
              <Text style={s.tmplMeta}>{tmpl.bpm} BPM · {tmpl.key}</Text>
              <Text style={s.tmplSecs}>{tmpl.secs.length} sections</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════
// SECTION CARD
// ══════════════════════════════════════════
function SectionCard({ sec, idx, expanded, onToggle, onUpdate, onToggleInst, onUpdateBeh, onDelete }) {
  const col = SEC_COLORS[sec.name] || '#888';

  return (
    <View style={[s.secCard, expanded && s.secCardOpen]}>
      {/* HEADER */}
      <TouchableOpacity style={s.secHdr} onPress={onToggle}>
        <View style={[s.secDot, { backgroundColor: col }]} />
        <Text style={[s.secName, { color: col }]}>{sec.name}</Text>
        <Text style={s.secMeta}>E{sec.energy} · ~{sec.bars}b · {sec.instruments.join('+') || '—'}</Text>
        <Text style={s.secCaret}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={s.secBody}>

          {/* ENERGY */}
          <Text style={s.fieldLabel}>ENERGY</Text>
          <View style={s.chipRow5}>
            {[1,2,3,4,5].map(n => (
              <TouchableOpacity
                key={n}
                style={[s.chip5, sec.energy === n && s.chip5On]}
                onPress={() => onUpdate('energy', n)}
              >
                <Text style={[s.chip5Txt, sec.energy === n && s.chip5TxtOn]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* MOOD */}
          <Text style={s.fieldLabel}>MOOD</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.chipRowH}>
              {MOODS.map(m => (
                <TouchableOpacity
                  key={m}
                  style={[s.chip, sec.mood === m && s.chipOn]}
                  onPress={() => onUpdate('mood', m)}
                >
                  <Text style={[s.chipTxt, sec.mood === m && s.chipTxtOn]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* HARMONY */}
          <Text style={s.fieldLabel}>CHORD MOVEMENT</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={s.chipRowH}>
              {HARMONIES.map(h => (
                <TouchableOpacity
                  key={h}
                  style={[s.chip, sec.harmony === h && s.chipOn]}
                  onPress={() => onUpdate('harmony', h)}
                >
                  <Text style={[s.chipTxt, sec.harmony === h && s.chipTxtOn]}>{h}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* BARS */}
          <Text style={s.fieldLabel}>BARS</Text>
          <View style={s.chipRowH}>
            {BARS_OPTIONS.map(b => (
              <TouchableOpacity
                key={b}
                style={[s.chip, sec.bars === b && s.chipOn]}
                onPress={() => onUpdate('bars', b)}
              >
                <Text style={[s.chipTxt, sec.bars === b && s.chipTxtOn]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* INSTRUMENTS */}
          <Text style={s.fieldLabel}>INSTRUMENTS ({sec.instruments.length}/3)</Text>
          <View style={s.instGrid}>
            {ALL_INSTS.map(inst => {
              const on = sec.instruments.includes(inst);
              const disabled = !on && sec.instruments.length >= 3;
              return (
                <TouchableOpacity
                  key={inst}
                  style={[s.instChip, on && s.instChipOn, disabled && s.instChipDis]}
                  onPress={() => !disabled && onToggleInst(inst)}
                >
                  <Text style={[s.instTxt, on && s.instTxtOn]}>{inst}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* BEHAVIORS */}
          {sec.instruments.map(inst => (
            <View key={inst} style={s.behBlock}>
              <Text style={s.behInst}>{inst.toUpperCase()}</Text>
              <TextInput
                style={s.behInput}
                value={sec.behaviors[inst] || ''}
                onChangeText={text => onUpdateBeh(inst, text)}
                placeholder="Describe behavior (or leave empty for auto)"
                placeholderTextColor="#3a4a5e"
                multiline
              />
            </View>
          ))}

          {/* DELETE */}
          <TouchableOpacity style={s.delBtn} onPress={onDelete}>
            <Text style={s.delTxt}>DELETE SECTION</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ══════════════════════════════════════════
// OUTPUT SCREEN
// ══════════════════════════════════════════
function OutputScreen({ output, onCopy, onBack, onNew }) {
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#10131a" />
      <View style={s.hdr}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={s.backTxt}>← EDIT</Text>
        </TouchableOpacity>
        <Text style={s.hdrTitle}>OUTPUT</Text>
        <TouchableOpacity onPress={onNew} style={s.newBtn}>
          <Text style={s.newTxt}>NEW</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll}>

        {/* STYLE */}
        <View style={s.outBlock}>
          <View style={s.outBlockHdr}>
            <Text style={s.outBlockTitle}>STYLE WINDOW</Text>
            <Text style={[s.outCharCount, output.style.length > 1000 && s.outCharOver]}>
              {output.style.length}/1000
            </Text>
            <TouchableOpacity
              style={s.copyBtn}
              onPress={() => onCopy(output.style, 'Style')}
            >
              <Text style={s.copyBtnTxt}>COPY</Text>
            </TouchableOpacity>
          </View>
          <View style={s.outBox}>
            <Text style={s.outStyleTxt}>{output.style}</Text>
          </View>
        </View>

        {/* CONTROL */}
        <View style={s.outBlock}>
          <View style={s.outBlockHdr}>
            <Text style={s.outBlockTitle}>CONTROL WINDOW</Text>
            <TouchableOpacity
              style={[s.copyBtn, { borderColor: 'rgba(32,96,224,.4)' }]}
              onPress={() => onCopy(output.ctrl, 'Control')}
            >
              <Text style={[s.copyBtnTxt, { color: '#2060e0' }]}>COPY</Text>
            </TouchableOpacity>
          </View>
          <View style={s.outBox}>
            <Text style={s.outCtrlTxt}>{output.ctrl}</Text>
          </View>
        </View>

        {/* RATE */}
        <View style={s.rateBlock}>
          <Text style={s.rateTitle}>DID THIS WORK IN SUNO?</Text>
          <View style={s.rateRow}>
            <TouchableOpacity style={[s.rateBtn, s.rateBtnY]} onPress={() => Alert.alert('Feedback saved: YES')}>
              <Text style={s.rateBtnTxt}>✓ YES</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.rateBtn, s.rateBtnP]} onPress={() => Alert.alert('Feedback saved: PARTIAL')}>
              <Text style={s.rateBtnTxt}>~ PARTIAL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.rateBtn, s.rateBtnN]} onPress={() => Alert.alert('Feedback saved: NO')}>
              <Text style={s.rateBtnTxt}>✗ NO</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════
const C = {
  bg: '#10131a', bg2: '#141820', bg3: '#191e28', bg4: '#1e2430',
  b1: '#242c3a', b2: '#2c3648',
  text: '#7a90a8', bright: '#ccdaea', dim: '#3a4a5e',
  acc: '#2060e0', grn: '#18c868', amb: '#d88020', red: '#c83030',
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },

  // HOME
  homeHdr: { alignItems: 'center', paddingTop: 40, paddingBottom: 10 },
  logo: { fontSize: 32, fontWeight: '900', color: C.acc, letterSpacing: 10 },
  logoSub: { fontSize: 10, color: C.dim, letterSpacing: 6, marginTop: 2 },
  homeHint: { textAlign: 'center', color: C.dim, fontSize: 11, marginBottom: 20, fontFamily: 'monospace' },
  tmplGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 },
  tmplCard: { width: '47%', backgroundColor: C.bg2, borderWidth: 1, borderColor: C.b1, padding: 14, marginBottom: 4 },
  tmplName: { color: C.bright, fontSize: 11, fontWeight: '700', fontFamily: 'monospace', marginBottom: 4, letterSpacing: 1 },
  tmplMeta: { color: C.text, fontSize: 9, fontFamily: 'monospace', marginBottom: 2 },
  tmplSecs: { color: C.dim, fontSize: 8, fontFamily: 'monospace' },

  // HEADER
  hdr: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg2, borderBottomWidth: 1, borderBottomColor: C.b1, paddingHorizontal: 12, paddingVertical: 10 },
  backBtn: { paddingRight: 10 },
  backTxt: { color: C.dim, fontSize: 9, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 1 },
  hdrCenter: { flex: 1, alignItems: 'center' },
  hdrTitle: { color: C.text, fontSize: 10, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 3 },
  hdrBpm: { color: C.bright, fontSize: 10, fontFamily: 'monospace', fontWeight: '700' },
  genBtn: { backgroundColor: 'rgba(32,96,224,.15)', borderWidth: 1, borderColor: 'rgba(32,96,224,.5)', paddingHorizontal: 12, paddingVertical: 6 },
  genTxt: { color: C.acc, fontSize: 9, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 1 },
  newBtn: { borderWidth: 1, borderColor: C.b2, paddingHorizontal: 10, paddingVertical: 5 },
  newTxt: { color: C.dim, fontSize: 9, fontFamily: 'monospace', fontWeight: '700' },

  // GUIDE BAR
  guideBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bg2, borderBottomWidth: 1, borderBottomColor: C.b1, paddingHorizontal: 12, paddingVertical: 8, justifyContent: 'center' },
  gsItem: { alignItems: 'center', gap: 3 },
  gsNum: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: C.b2, alignItems: 'center', justifyContent: 'center' },
  gsNumActive: { backgroundColor: C.acc, borderColor: C.acc },
  gsNumDone: { backgroundColor: C.grn, borderColor: C.grn },
  gsNumTxt: { color: C.dim, fontSize: 7, fontWeight: '700', fontFamily: 'monospace' },
  gsNumTxtActive: { color: '#fff' },
  gsLabel: { color: C.dim, fontSize: 6, fontFamily: 'monospace', fontWeight: '700', letterSpacing: .5 },
  gsLabelActive: { color: C.bright },
  gsLabelDone: { color: C.grn },
  gsArrow: { color: C.b2, fontSize: 12, marginHorizontal: 6 },

  // SECTIONS
  section: { backgroundColor: C.bg2, borderBottomWidth: 1, borderBottomColor: C.b1, padding: 12 },
  sectionTitle: { color: C.dim, fontSize: 7, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 3, marginBottom: 10, textTransform: 'uppercase' },

  // PARAMS
  paramRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  paramLabel: { color: C.dim, fontSize: 7, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 2, marginBottom: 6 },
  paramInput: { backgroundColor: C.bg4, borderWidth: 1, borderColor: C.b1, color: C.bright, fontFamily: 'monospace', fontSize: 14, fontWeight: '700', padding: 6, width: 70, textAlign: 'center' },

  // CHIPS
  chipRow: { flexDirection: 'row', marginBottom: 4 },
  chipRowH: { flexDirection: 'row', gap: 5, marginBottom: 4 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: C.b2, marginRight: 5 },
  chipOn: { borderColor: C.acc, backgroundColor: 'rgba(32,96,224,.1)' },
  chipTxt: { color: C.dim, fontSize: 9, fontFamily: 'monospace', fontWeight: '700' },
  chipTxtOn: { color: C.acc },

  // CHIP 5 (energy)
  chipRow5: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  chip5: { flex: 1, paddingVertical: 8, borderWidth: 1, borderColor: C.b2, alignItems: 'center' },
  chip5On: { borderColor: C.acc, backgroundColor: 'rgba(32,96,224,.1)' },
  chip5Txt: { color: C.dim, fontSize: 12, fontFamily: 'monospace', fontWeight: '700' },
  chip5TxtOn: { color: C.acc },

  // ADD SECTION TYPES
  secTypesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  secTypeBtn: { width: '30%', paddingVertical: 10, borderWidth: 1, alignItems: 'center' },
  secTypeTxt: { fontSize: 9, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 1 },

  // SECTION CARD
  secCard: { backgroundColor: C.bg2, borderBottomWidth: 1, borderBottomColor: C.b1, marginBottom: 1 },
  secCardOpen: { borderLeftWidth: 2, borderLeftColor: C.acc },
  secHdr: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 },
  secDot: { width: 8, height: 8, borderRadius: 4 },
  secName: { fontSize: 11, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 2, flex: 1 },
  secMeta: { color: C.dim, fontSize: 8, fontFamily: 'monospace', fontWeight: '600' },
  secCaret: { color: C.dim, fontSize: 9 },
  secBody: { padding: 12, paddingTop: 4 },

  // FIELD
  fieldLabel: { color: C.dim, fontSize: 7, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 2, marginBottom: 6, marginTop: 8 },

  // INSTRUMENTS
  instGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 10 },
  instChip: { paddingHorizontal: 8, paddingVertical: 5, borderWidth: 1, borderColor: C.b2 },
  instChipOn: { borderColor: C.acc, backgroundColor: 'rgba(32,96,224,.08)' },
  instChipDis: { opacity: 0.3 },
  instTxt: { color: C.dim, fontSize: 9, fontFamily: 'monospace', fontWeight: '700' },
  instTxtOn: { color: C.acc },

  // BEHAVIOR
  behBlock: { backgroundColor: C.bg4, borderWidth: 1, borderColor: C.b1, padding: 8, marginBottom: 6 },
  behInst: { color: C.acc, fontSize: 7, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 2, marginBottom: 5 },
  behInput: { color: C.bright, fontSize: 10, fontFamily: 'monospace', borderBottomWidth: 1, borderBottomColor: C.b1, paddingVertical: 4, minHeight: 32 },

  // DELETE
  delBtn: { borderWidth: 1, borderColor: 'rgba(200,48,48,.3)', padding: 8, alignItems: 'center', marginTop: 10 },
  delTxt: { color: C.red, fontSize: 8, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 1 },

  // EMPTY
  emptyState: { padding: 40, alignItems: 'center' },
  emptyTxt: { color: C.dim, fontSize: 10, fontFamily: 'monospace', textAlign: 'center', lineHeight: 20 },

  // OUTPUT
  outBlock: { margin: 12, marginBottom: 6 },
  outBlockHdr: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  outBlockTitle: { color: C.dim, fontSize: 7, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 3, flex: 1 },
  outCharCount: { color: C.grn, fontSize: 8, fontFamily: 'monospace', fontWeight: '700' },
  outCharOver: { color: C.red },
  copyBtn: { borderWidth: 1, borderColor: 'rgba(24,200,104,.4)', paddingHorizontal: 10, paddingVertical: 4 },
  copyBtnTxt: { color: C.grn, fontSize: 8, fontFamily: 'monospace', fontWeight: '700', letterSpacing: 1 },
  outBox: { backgroundColor: C.bg3, borderWidth: 1, borderColor: C.b1, padding: 10 },
  outStyleTxt: { color: '#5ae890', fontSize: 9, fontFamily: 'monospace', lineHeight: 16 },
  outCtrlTxt: { color: '#7ab4ff', fontSize: 9, fontFamily: 'monospace', lineHeight: 16 },

  // RATE
  rateBlock: { margin: 12, backgroundColor: C.bg2, borderWidth: 1, borderColor: C.b1, padding: 14 },
  rateTitle: { color: C.bright, fontSize: 10, fontFamily: 'monospace', fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  rateRow: { flexDirection: 'row', gap: 8 },
  rateBtn: { flex: 1, paddingVertical: 10, borderWidth: 1, alignItems: 'center' },
  rateBtnY: { borderColor: 'rgba(24,200,104,.4)', backgroundColor: 'rgba(24,200,104,.06)' },
  rateBtnP: { borderColor: 'rgba(216,128,32,.4)', backgroundColor: 'rgba(216,128,32,.06)' },
  rateBtnN: { borderColor: 'rgba(200,48,48,.4)', backgroundColor: 'rgba(200,48,48,.06)' },
  rateBtnTxt: { fontSize: 9, fontFamily: 'monospace', fontWeight: '700', color: C.bright },
});
