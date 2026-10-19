# A025 — blocked: required source deliveries absent

Branch: `a025-near-shoulder`.

The packet was read, along with STATUS, the drawing/asset contracts, rig-standard section 5b, the user's joint points, and the A023 source inventory and rig-source metadata. Git LFS is installed (3.8.0). The runner's existing branch was retained; no checkout, pull, or push was attempted.

## Missing inputs

- `assets/source/A024-rat-limb-repairs/` — absent. The packet identifies these as the current arm ends.
- `assets/source/A020-rat-gear-every-view/` — absent. The required `torso-jerkin` source cannot be edited or checked.

The source directory inventory contains A021, A022, and A023, but neither required folder. No alternative source location was supplied in the packet.

## Delivery state

Blocked; no image assets delivered. No image generation was run because using the older A023 arm ends would risk undoing A024, and inventing a jerkin would violate the requirement to preserve visible paint at rest. No pivots, paint, existing images, or runtime files were changed. No shoulder sweep or master paint pass is claimed. The assets ledger is not marked `source`.

## Resume requirement

Make the A024 current arm repairs and A020 gear source folders available on this branch, or supply their corrected paths. Then perform the image-tool chest inpainting and exact shoulder-pad transfer, retaining the canvases and all unrelated pivots; deliver all six near-arm PNGs, torso and torso-jerkin, Q draw-order fragment, prompts, rest/master comparison, sweep at -61/-30/0/+30/+59 degrees, review PNG and phone JPGs.

Do not remove the shoulder-near cap from other views based on this incomplete delivery; they require their existing coverage until checked on the body.
