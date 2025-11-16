# Docker, backend image, and release automation

## Summary
Update the Docker Compose stack and release workflow so the app targets the latest Chroma server image and produces signed, semantically versioned artifacts.

## Tasks
- [ ] Point `docker/docker-compose.yaml` at the latest `ghcr.io/chroma-core/chroma` image and capture any new env vars required for multi-auth setups.
- [ ] Verify that the multi-auth configuration (ports 8001–8003) keeps working after the backend upgrade.
- [ ] Ensure the release workflow tags Docker images with semantic versions and, if required, attaches SBOM/signing steps.
- [ ] Align the release workflow's GitHub Action versions with the upgraded build workflow so both stay supported.
