# Push this project to your GitHub repository (Windows PowerShell)

The GitHub connector used for this chat returned `403 Resource not accessible by integration` when attempting to write files. This project bundle is ready to push locally.

1. Download and extract the `orderlens-ai-repo.zip` bundle.
2. Open PowerShell in the extracted `orderlens-ai-repo` folder.
3. Run the following commands. If you already have a local clone of this repository, copy the files into that clone instead and skip `git init` / `git remote add`.

```powershell
git init -b main
git add .
git commit -m "feat: add OrderLens AI feedback intelligence prototype"
git remote add origin https://github.com/Suhaniverma2004/orderlens-ai.git
git push -u origin main
```

If Git says the `origin` remote already exists, run `git remote set-url origin https://github.com/Suhaniverma2004/orderlens-ai.git` and retry. If push asks for authentication, finish the sign-in flow in your Git credential manager or use GitHub Desktop. Never paste a personal access token into this README or a public file.
