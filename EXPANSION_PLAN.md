# Skull King Expansion Pack Implementation Plan

## Overview

This document outlines the phased implementation plan for adding full Skull King Expansion Pack support to the score keeper application. The expansion adds new cards, bonus types, and supports up to 9 players.

**Implementation Philosophy**: Incremental, test-driven development with review cycles after each phase.

---

## Current State Analysis

### ✅ Already Implemented (Base Game + Partial Expansion)
- **Kraken & White Whale**: Full support including UI checkboxes, destroyed trick logic, and visual indicators
- **Loot Cards**: Basic bonus counter exists (+20 points)
- **Graybeard Mode**: 2-player ghost player support
- **Bonus Calculator**: Interactive modal with counters for standard bonuses
- **Test Coverage**: 110+ unit tests covering existing features

### ❌ Not Yet Implemented (Full Expansion Pack)
- **New Number Cards**: 7s, 8s, 0/14s with special bonus rules
- **Wild 15**: New wild card (doesn't affect scoring directly)
- **Mary Thorne**: Additional pirate card
- **First Mate Con**: Special pirate with unique bonus rules
- **Spotted Stingray**: Third sea monster
- **Davy Jones' Locker**: Sea monster destroyer with bonuses
- **Walk the Plank**: Pirate removal card (no scoring impact)
- **Last Volley**: Extra card play mechanic (no scoring impact)
- **9-Player Support**: Expansion allows up to 9 players

---

## Implementation Phases

### **Phase 1: Foundation & Expansion Mode Toggle** 🎯

**Goal**: Add expansion mode setting and data model updates.

#### 1.1 Data Model Updates
```typescript
interface GameStateData {
    expansionMode: boolean;  // NEW: whether expansion pack is enabled
    // ... existing fields
}

interface RoundData {
    krakenPlayed?: boolean;  // EXISTING
    whalePlayed?: boolean;   // EXISTING
    stingrayPlayed?: boolean; // NEW: Spotted Stingray
    davyJonesMonsters?: number; // NEW: sea monsters captured by Davy Jones (0-3)
    // ... existing fields
}
```

#### 1.2 Game Setup UI
- Add "Play with Expansion Pack?" checkbox in player setup screen
- Position: Below scoring mode selection, above player name inputs
- Store expansion preference in localStorage (like scoring mode)
- Update player count validation:
  - Standard mode: 2-8 players (70 cards)
  - Expansion mode: 2-9 players (84+ cards with expansion)

#### 1.3 Tests
- [ ] Test expansion mode storage/retrieval
- [ ] Test player count validation with expansion on/off
- [ ] Test expansion mode persists across page reloads
- [ ] Test expansion mode resets with new game

**Deliverable**: Expansion mode toggle that affects player count limits.

---

### **Phase 2: Expansion Bonus Types in Calculator** 🧮

**Goal**: Add all expansion-specific bonus point types to the bonus calculator modal.

#### 2.1 New Bonus Counters

Add to bonus calculator modal (conditional on expansion mode):

| Bonus Type | Points | Max Count | Rules |
|------------|--------|-----------|-------|
| **7 Captured** | -5 each | 4 | Only when bid is made |
| **8 Captured** | +5 each | 4 | Only when bid is made |
| **0/14 Captured** | 0 | 4 | No bonus (counts as standard 14 visually, but worth 0) |
| **First Mate Con** | +30 | 1 | When captured by Skull King or Mermaid |
| **Davy Jones Sea Monsters** | +20 each | 3 | Kraken, Whale, or Stingray captured |

**Notes**:
- 0/14 cards: Players declare them as 0 or 14 during play, but they grant NO bonus points when captured (unlike standard 14s)
- Mary Thorne: Uses existing pirate capture bonuses (+20/+30), no new counter needed
- Wild 15: No bonus points, just a game mechanic

#### 2.2 UI Design
- **Layout**: Add "Expansion Bonuses" section to calculator modal
- **Conditional Rendering**: Only show when `expansionMode === true`
- **Visual Separation**: Use divider line or section header "Expansion Pack Bonuses"
- **Tooltips**: Add help icons explaining each bonus type

#### 2.3 Validation Updates
- 7s/8s bonuses only apply when bid is made (like other bonuses)
- First Mate Con captured: +30 (doesn't earn pirate bonuses for itself)
- Davy Jones captures: Count sea monsters destroyed (affects bonus, not trick count)

#### 2.4 Tests
- [ ] Test expansion bonus calculation
- [ ] Test 7/8 bonuses only apply when bid is made
- [ ] Test First Mate Con capture bonus
- [ ] Test Davy Jones sea monster captures
- [ ] Test bonus calculator shows/hides expansion bonuses based on mode
- [ ] Test bonus total includes expansion bonuses correctly

**Deliverable**: Fully functional expansion bonus calculator with validation.

---

### **Phase 3: Spotted Stingray & Davy Jones UI** 🦈

**Goal**: Add UI elements for expansion sea monsters and special cards.

#### 3.1 Spotted Stingray Checkbox
- Add third checkbox next to Kraken and Whale: "🦈 Spotted Stingray played"
- Only visible when expansion mode is enabled
- Destroys 1 trick (reduces expected trick count)
- Show 🦈 icon in round history when checked

#### 3.2 Davy Jones Input
- **Location**: Below sea monster checkboxes in round entry
- **Label**: "Davy Jones' Locker: Sea Monsters Destroyed"
- **Input**: Number field (0-3)
- **Logic**: 
  - Each sea monster destroyed = +20 bonus points
  - Does NOT reduce trick count (bonuses are separate from trick destruction)
  - Validation: Max 3 (can't destroy more than the 3 expansion sea monsters)

#### 3.3 Visual Indicators
- Round history: Show 🦈 for Stingray, special indicator for Davy Jones
- Example: "Round 3 🐙🐋🦈⚓" (all expansion cards played)

#### 3.4 Tests
- [ ] Test Stingray checkbox reduces trick count by 1
- [ ] Test Davy Jones input validates 0-3 range
- [ ] Test Davy Jones bonus calculation (+20 per monster)
- [ ] Test round history shows correct expansion icons
- [ ] Test expansion cards only visible when expansion mode enabled

**Deliverable**: Complete UI for all expansion cards affecting gameplay.

---

### **Phase 4: Commentary & Polish** ✨

**Goal**: Add expansion-specific commentary and refinements.

#### 4.1 Expansion Commentary
Add new commentary variants for expansion scenarios:
- **Sea Monster Mayhem**: "Arr! The sea monsters be raisin' havoc this round!"
- **Davy Jones Active**: "Davy Jones sent [X] beasts to the depths!"
- **Multiple Expansion Cards**: "Blimey! The expansion cards be flyin' thick as cannonballs!"
- **First Mate Con Captured**: "First Mate Con be earnin' his keep for the captor!"

#### 4.2 Translation Updates
Add translation strings for:
- Expansion mode toggle label
- Spotted Stingray checkbox
- Davy Jones input label
- New bonus calculator labels (7, 8, First Mate Con, Davy Jones)
- Expansion commentary variants

Languages: English, German, Spanish

#### 4.3 Help Text & Documentation
- **Bonus Calculator**: Add tooltips explaining expansion bonuses
- **README.md**: Update features list with expansion support
- **RULES.md**: Add expansion card rules reference (or link to expansion rules)

#### 4.4 Tests
- [ ] Test expansion commentary generates correctly
- [ ] Test translations load for all expansion strings
- [ ] Test help tooltips display properly

**Deliverable**: Polished, multilingual expansion support with helpful commentary.

---

## Development Workflow

### For Each Phase:
1. **Write Tests First**: Create unit tests for new functionality
2. **Implement Feature**: Code the minimal changes needed
3. **Review**: Human reviews tests and implementation
4. **Iterate**: Refine based on feedback
5. **Visual Testing**: Use Playwright to verify UI changes
6. **Commit**: Once approved, commit the phase

### Testing Strategy:
- **Unit Tests**: All scoring logic, validation, state management
- **Manual Testing**: UI interactions, visual appearance
- **Playwright**: Automated visual regression testing (optional)
- **Cross-browser**: Test on Chrome, Safari, Firefox mobile

### Git Strategy:
- Create feature branch per phase: `feature/expansion-phase-1`
- Commit after each completed phase
- Merge to `main` after human approval
- Deploy to staging for integration testing
- Deploy to prod after all phases complete

---

## Out of Scope (Not Implementing)

These expansion cards don't affect scoring and won't be tracked:

- **Walk the Plank**: Removes pirates from tricks (game mechanic, no scoring impact)
- **Last Volley**: Extra card play (game mechanic, no scoring impact)
- **Wild 15**: Suit substitution (game mechanic, no bonus points)
- **0/14 Cards**: Flexible value (tracked only for visual clarity, no bonus)
- **Pirate Abilities**: Special powers (not relevant for score keeping)

**Rationale**: This is a score keeper, not a full game implementation. We track what affects points, not every card play.

---

## Technical Considerations

### Backward Compatibility
- Existing games without expansion mode should continue to work
- Default `expansionMode` to `false` for backward compatibility
- Gracefully handle old saved games (pre-expansion) by defaulting expansion flags to false

### Mobile Optimization
- Ensure expansion checkboxes/inputs work on touch devices
- Test bonus calculator scrolling on mobile with extra expansion bonuses
- Verify all new UI elements are responsive

### Performance
- No significant performance impact expected
- Expansion bonuses add ~6 new counters to calculator modal (minimal overhead)
- State serialization remains efficient

---

## Success Criteria

### Phase 1 Complete When:
- [x] Expansion mode toggle exists and persists
- [x] Player count validation changes based on expansion mode
- [x] All unit tests pass
- [x] Manual testing confirms toggle works correctly

### Phase 2 Complete When:
- [x] All expansion bonuses appear in calculator (when enabled)
- [x] Bonus calculations are correct and validated
- [x] Tests cover all new bonus types
- [x] Manual testing confirms bonus calculator works

### Phase 3 Complete When:
- [x] Stingray checkbox works like Kraken/Whale
- [x] Davy Jones input validates and calculates correctly
- [x] Round history shows all expansion indicators
- [x] Tests verify destroyed trick logic and bonuses

### Phase 4 Complete When:
- [x] Expansion commentary plays appropriately
- [x] All translations are complete (EN/DE/ES)
- [x] Documentation is updated
- [x] Full integration testing passes

### Overall Project Complete When:
- [x] All phases 1-3 are complete
- [x] Staging deployment is tested and approved
- [x] Production deployment is successful
- [x] No regressions in existing functionality
- [x] README and documentation reflect expansion support

---

## Timeline Estimate

- **Phase 1**: 1-2 hours (foundation)
- **Phase 2**: 2-3 hours (bonus calculator)
- **Phase 3**: 1-2 hours (UI elements)
- **Phase 4**: 1-2 hours (polish)

**Total**: ~5-9 hours of active development (spread across review cycles)

---

## Notes

- Implementation will be iterative with human review at each step
- UI design may evolve based on visual testing and feedback
- Commentary variants can be expanded over time
- Future enhancements (pirate abilities, etc.) can be added later if needed

---

**Document Version**: 1.0  
**Last Updated**: 2025-12-01  
**Status**: Ready for Phase 1 Implementation
