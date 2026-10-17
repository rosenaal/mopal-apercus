"""Presets de couleur. Chaque preset : fond légèrement teinté, encre, un seul
accent. `on_ink` dit si l'accent porte l'encre (True) ou le blanc (False)."""

PRESETS = {
    # id: (bg_hue, bg_sat, ink_h, ink_s, accent, accent_soft, accent_strong, on_ink, note)
    "chartreuse": dict(bg="72 12% 96%", bg_deep="72 10% 92%", ink="80 8% 10%", night="80 9% 9%", muted_fg="78 5% 38%", border="72 8% 88%",
                       accent="76 47% 47%", soft="76 50% 88%", strong="78 62% 25%", on_ink=True, line_night="80 6% 20%"),
    "ambre": dict(bg="40 30% 96%", bg_deep="40 24% 92%", ink="30 12% 10%", night="30 12% 9%", muted_fg="32 8% 38%", border="40 14% 87%",
                  accent="38 88% 54%", soft="40 85% 88%", strong="32 75% 30%", on_ink=True, line_night="30 8% 20%"),
    "tuile": dict(bg="24 28% 96%", bg_deep="24 22% 92%", ink="20 14% 11%", night="20 14% 9%", muted_fg="22 8% 38%", border="24 14% 87%",
                  accent="16 62% 46%", soft="18 60% 90%", strong="16 62% 34%", on_ink=False, line_night="20 8% 20%"),
    "sarcelle": dict(bg="180 16% 96%", bg_deep="180 12% 92%", ink="195 22% 10%", night="195 22% 8%", muted_fg="190 8% 38%", border="180 10% 87%",
                     accent="178 52% 34%", soft="178 45% 88%", strong="178 58% 24%", on_ink=False, line_night="190 8% 20%"),
    "marine": dict(bg="215 22% 96%", bg_deep="215 18% 92%", ink="222 32% 11%", night="222 32% 9%", muted_fg="218 10% 40%", border="215 12% 87%",
                   accent="218 72% 42%", soft="218 70% 90%", strong="218 72% 32%", on_ink=False, line_night="220 10% 20%"),
    "ardoise": dict(bg="210 12% 96%", bg_deep="210 10% 92%", ink="212 14% 12%", night="212 14% 9%", muted_fg="210 7% 40%", border="210 8% 87%",
                    accent="168 38% 36%", soft="168 35% 88%", strong="168 42% 26%", on_ink=False, line_night="212 8% 20%"),
    "mousse": dict(bg="90 16% 96%", bg_deep="90 12% 92%", ink="120 16% 9%", night="120 16% 7%", muted_fg="110 7% 38%", border="90 9% 87%",
                   accent="140 36% 32%", soft="140 32% 88%", strong="140 42% 22%", on_ink=False, line_night="120 8% 20%"),
    "vermillon": dict(bg="20 16% 97%", bg_deep="20 12% 93%", ink="10 10% 10%", night="10 10% 8%", muted_fg="12 6% 40%", border="20 8% 88%",
                      accent="8 78% 50%", soft="8 80% 91%", strong="8 72% 36%", on_ink=False, line_night="10 6% 20%"),
    "laiton": dict(bg="45 28% 96%", bg_deep="45 22% 92%", ink="222 12% 12%", night="222 12% 9%", muted_fg="220 6% 40%", border="45 12% 87%",
                   accent="42 64% 50%", soft="42 60% 88%", strong="40 62% 28%", on_ink=True, line_night="222 6% 20%"),
    "cobalt": dict(bg="225 22% 97%", bg_deep="225 18% 93%", ink="232 28% 10%", night="232 28% 8%", muted_fg="228 10% 42%", border="225 12% 88%",
                   accent="228 82% 56%", soft="228 80% 92%", strong="228 72% 40%", on_ink=False, line_night="230 10% 20%"),
    "cramoisi": dict(bg="350 16% 97%", bg_deep="350 12% 93%", ink="252 22% 12%", night="252 22% 9%", muted_fg="255 8% 42%", border="350 8% 88%",
                     accent="348 70% 42%", soft="348 65% 91%", strong="348 70% 30%", on_ink=False, line_night="252 8% 22%"),
    "olive": dict(bg="60 14% 96%", bg_deep="60 10% 92%", ink="70 10% 10%", night="70 10% 8%", muted_fg="68 6% 38%", border="60 8% 87%",
                  accent="70 42% 40%", soft="70 40% 88%", strong="70 48% 26%", on_ink=False, line_night="70 6% 20%"),
    "zinc": dict(bg="220 8% 96%", bg_deep="220 7% 92%", ink="220 10% 11%", night="220 10% 8%", muted_fg="220 5% 40%", border="220 6% 87%",
                 accent="205 55% 45%", soft="205 55% 90%", strong="205 60% 32%", on_ink=False, line_night="220 6% 20%"),
}

def theme_css(preset: str) -> str:
    p = PRESETS.get(preset) or PRESETS["chartreuse"]
    on_accent = p["ink"] if p["on_ink"] else "0 0% 100%"
    return f""":root {{
  color-scheme: light;
  --background: {p['bg']};
  --foreground: {p['ink']};
  --card: 0 0% 100%;
  --card-foreground: {p['ink']};
  --primary: {p['ink']};
  --primary-foreground: 0 0% 100%;
  --secondary: {p['night']};
  --secondary-foreground: 0 0% 100%;
  --muted: {p['bg_deep']};
  --muted-foreground: {p['muted_fg']};
  --accent: {p['accent']};
  --accent-foreground: {on_accent};
  --on-accent: {on_accent};
  --border: {p['border']};
  --input: {p['border']};
  --ring: {p['ink']};
  --radius: 1.5rem;
  --paper: {p['bg']};
  --paper-deep: {p['bg_deep']};
  --ink: {p['ink']};
  --night: {p['night']};
  --chartreuse: {p['accent']};
  --chartreuse-soft: {p['soft']};
  --chartreuse-strong: {p['strong']};
  --line: {p['border']};
  --line-night: {p['line_night']};
  --danger: 4 70% 40%;
  --shadow-soft: 0 1px 2px hsl({p['ink']} / 0.04), 0 24px 48px -24px hsl({p['ink']} / 0.14);
  --shadow-float: 0 2px 4px hsl({p['ink']} / 0.04), 0 40px 80px -32px hsl({p['ink']} / 0.22);
  --ease: cubic-bezier(0.32, 0.72, 0, 1);
}}
"""

if __name__ == "__main__":
    import sys
    print(theme_css(sys.argv[1] if len(sys.argv) > 1 else "chartreuse"))
