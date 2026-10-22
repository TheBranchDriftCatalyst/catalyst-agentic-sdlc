// commit-and-tag-version updater for .claude-plugin/marketplace.json
//
// WHY THIS EXISTS
//   Every other bumpFiles entry is a plain `{"version": "x.y.z"}` at the top
//   level, which the built-in "json" updater handles. marketplace.json is not:
//   its versions live one per entry under `.plugins[].version`, so the built-in
//   updater finds no top-level `version` and silently leaves the file alone.
//
//   That is exactly what happened. Every marketplace entry sat at 0.1.0 while
//   the plugin manifests moved on to 0.2.0 / 0.2.1 / 0.3.0 — the marketplace
//   was advertising versions that no longer existed anywhere in the repo.
//
//   Versions are LOCKSTEP here: one repo, one release, every plugin and every
//   marketplace entry carries the same number. That is a deliberate choice over
//   per-plugin versioning — it makes "which version am I running" answerable
//   from a single field, and makes drift between the two files unrepresentable
//   rather than merely discouraged.
//
//   Note the manifest wins over the entry when the two disagree (Claude Code
//   reads `version` from plugin.json in preference to the marketplace entry),
//   so a stale entry is not fatal — it is just a lie in the shop window. This
//   keeps them honest.

module.exports.readVersion = function readVersion(contents) {
  const json = JSON.parse(contents);
  const plugins = Array.isArray(json.plugins) ? json.plugins : [];
  // Report the highest version present, not plugins[0]: entries have drifted
  // apart before, and taking the first one would let a stale leading entry
  // drag the computed "current" version backwards.
  const versions = plugins.map((p) => p && p.version).filter(Boolean);
  if (versions.length === 0) return "0.0.0";
  return versions.sort(compareSemver).at(-1);
};

module.exports.writeVersion = function writeVersion(contents, version) {
  const json = JSON.parse(contents);
  if (Array.isArray(json.plugins)) {
    for (const plugin of json.plugins) {
      if (plugin && typeof plugin === "object") plugin.version = version;
    }
  }
  // A top-level version is optional in a marketplace manifest; only touch it
  // when it is already there, so this never invents a field the schema did
  // not have.
  if (Object.prototype.hasOwnProperty.call(json, "version")) {
    json.version = version;
  }
  // Trailing newline: prettier runs over *.json in pre-commit, and without it
  // every release would produce a one-character reformat on the next commit.
  return JSON.stringify(json, null, 2) + "\n";
};

function compareSemver(a, b) {
  const parse = (v) =>
    String(v)
      .split("-")[0]
      .split(".")
      .map((n) => parseInt(n, 10) || 0);
  const [a1, a2, a3] = parse(a);
  const [b1, b2, b3] = parse(b);
  return a1 - b1 || a2 - b2 || a3 - b3;
}
