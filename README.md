# Diamond BitBurner Scripts

A collection of useful BitBurner (Netscript) scripts, utilities, and examples maintained by DiamondSkyline. This repository contains automation, batching, and helper scripts designed to be run inside the BitBurner game environment to help manage servers, hacking automation, and economy tasks.

## Repository layout

- `scripts/` — Primary user-facing scripts you can run from the BitBurner terminal.
- `lib/` — Shared helper modules used by scripts (common utilities, wrappers around the `ns` API).
- `tools/` — Small utilities and one-off tools for testing and development.
- `examples/` — Example usages and demos showing how to use the library functions.

If any of these directories are missing, create them and add scripts or examples as appropriate.

## Key features

- Practical, well-documented scripts for server management, hacking automation, and batching.
- Modular helper library to keep scripts DRY and easy to reuse.
- Example-driven approach so you can copy/modify working examples instead of starting from scratch.

## Requirements

- BitBurner (latest stable version recommended).
- Scripts are written for the BitBurner Netscript runtime and use the `ns` API. They are not intended to be run with plain Node.js.

## Installation (in-game)

1. Open BitBurner in your browser.
2. Create a new file in the Scripts folder or upload files through the in-game file editor.
3. Copy the files from this repository into the BitBurner file system.

To download files from a GitHub raw URL inside BitBurner, use `wget` from the in-game terminal, for example:

```text
// inside BitBurner terminal:
wget https://raw.githubusercontent.com/DiamondSkyline/Diamond-BitBurner-Src/main/scripts/example.js example.js
```

## Usage

Run scripts from the BitBurner terminal. Typical examples:

```text
run scripts/hack-manager.js
run scripts/grow-all.js target=n00dles
```

Most scripts accept arguments — check the top of each script for usage notes and examples.

## Contributing

Contributions, bug reports, and suggestions are welcome. Please open an issue describing the change or submit a pull request.

Guidelines:
- Keep scripts modular and add examples in `examples/`.
- Document new scripts with usage examples and expected arguments.
- Include short comments explaining assumptions and required RAM levels where applicable.

## License

No license file is included by default. If you want this project to be open-source, add a LICENSE (for example, MIT) and update this section accordingly.

## Contact

Maintained by DiamondSkyline. For questions or help, open an issue in this repository.
