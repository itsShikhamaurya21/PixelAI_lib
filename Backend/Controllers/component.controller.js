
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";

import Component from "../Models/component.model.js";
import User from "../Models/user.model.js";
import { askAI } from "../utils/openRouter.js";


const execAsync = promisify(exec);

// =====================================================
// LIBRARY PATH CONFIGURATION
// Controller: Backend/Controllers/
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PIXELAI_LIB_DIR = path.resolve(
  __dirname,
  "../../PixelAI-lib"
);

const LIBRARY_COMPONENTS_DIR = path.join(
  PIXELAI_LIB_DIR,
  "src",
  "Components"
);

const LIBRARY_ENTRY_FILE = path.join(
  PIXELAI_LIB_DIR,
  "src",
  "index.js"
);

// =====================================================
// HELPER: CREATE SAFE COMPONENT NAME
// Example: Primary Button -> PrimaryButton
// =====================================================

const createFileName = (name) => {
  const safeName = name
    .trim()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) =>
      char.toUpperCase()
    )
    .replace(/[^a-zA-Z0-9_$]/g, "");

  if (!safeName) {
    throw new Error("Invalid component name");
  }

  const validName = /^[a-zA-Z_$]/.test(safeName)
    ? safeName
    : `Component${safeName}`;

  // React component names should start with uppercase.
  return validName.charAt(0).toUpperCase() + validName.slice(1);
};

// =====================================================
// HELPER: ESCAPE REGEX CHARACTERS
// =====================================================

const escapeRegExp = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// =====================================================
// HELPER: NORMALIZE AI GENERATED REACT CODE
//
// Automatically:
// 1. Removes Markdown code fences.
// 2. Checks for an existing default export.
// 3. Supports named function/component exports.
// 4. Adds default export when missing.
// 5. Uses the actual declared component identifier.
// =====================================================


const normalizeComponentCode = (code, componentName) => {
  if (typeof code !== "string" || !code.trim()) {
    throw new Error("Generated component code is empty");
  }

  let finalCode = code
    .replace(/^\s*```(?:jsx|js|javascript|tsx|ts)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  // Find component declarations.
  const declarationRegex =
    /\b(?:export\s+)?(?:function|class)\s+([A-Z][A-Za-z0-9_$]*)\b|\b(?:export\s+)?(?:const|let|var)\s+([A-Z][A-Za-z0-9_$]*)\s*=/g;

  const declarations = [
    ...finalCode.matchAll(declarationRegex),
  ].map((match) => match[1] || match[2]);

  if (!declarations.length) {
    throw new Error(
      "Could not find a named React component declaration"
    );
  }

  const componentIdentifier =
    declarations.find((name) => name === componentName) ||
    declarations[0];

  // Remove named export from the main component declaration.
  const escapedIdentifier = componentIdentifier.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const namedExportRegex = new RegExp(
    `\\bexport\\s+(?=(?:function|class|const|let|var)\\s+${escapedIdentifier}\\b)`
  );

  finalCode = finalCode.replace(namedExportRegex, "");

  // Add React import only if the code uses React
  // as an identifier but does not import or declare it.
  const usesReactIdentifier =
    /\bReact\b/.test(finalCode) ||
    /<>|<\/>/.test(finalCode);

  const hasReactImport =
    /\bimport\s+(?:React\b|\{[^}]*\bReact\b[^}]*\}|\*\s+as\s+React\b)[^;]*from\s*["']react["']/.test(finalCode);

  const hasReactDeclaration =
    /\b(?:const|let|var|function|class)\s+React\b/.test(finalCode);

  if (
    usesReactIdentifier &&
    !hasReactImport &&
    !hasReactDeclaration
  ) {
    finalCode = `import React from "react";\n${finalCode}`;
  }

  // Add default export only if it does not already exist.
  if (!/\bexport\s+default\b/.test(finalCode)) {
    finalCode += `\n\nexport default ${componentIdentifier};\n`;
  }

  return finalCode;
};


// =====================================================
// HELPER: CREATE COMPONENT FOLDER AND JSX FILE
// Also updates src/index.js
// =====================================================

const createComponentFile = async (name, code) => {
  const componentName = createFileName(name);

  await fs.mkdir(LIBRARY_COMPONENTS_DIR, {
    recursive: true,
  });

  const componentDir = path.join(
    LIBRARY_COMPONENTS_DIR,
    componentName
  );

  await fs.mkdir(componentDir, {
    recursive: true,
  });

  const filePath = path.join(
    componentDir,
    `${componentName}.jsx`
  );

  // Automatically normalize AI code before saving.
  const finalCode = normalizeComponentCode(
    code,
    componentName
  );

  // Prevent accidental overwriting.
  await fs.writeFile(filePath, finalCode, {
    encoding: "utf8",
    flag: "wx",
  });

  try {
    // Ensure src/index.js exists.
    await fs.mkdir(path.dirname(LIBRARY_ENTRY_FILE), {
      recursive: true,
    });

    try {
      await fs.access(LIBRARY_ENTRY_FILE);
    } catch {
      await fs.writeFile(
        LIBRARY_ENTRY_FILE,
        "",
        "utf8"
      );
    }

    const exportStatement =
      `export { default as ${componentName} } from "./Components/${componentName}/${componentName}.jsx";`;

    const existingContent = await fs.readFile(
      LIBRARY_ENTRY_FILE,
      "utf8"
    );

    // Prevent duplicate exports.
    if (!existingContent.includes(exportStatement)) {
      await fs.appendFile(
        LIBRARY_ENTRY_FILE,
        `\n${exportStatement}\n`,
        "utf8"
      );
    }

    return {
      componentName,
      fileName: `${componentName}.jsx`,
      filePath,
      exportStatement,
      componentDir,
      finalCode,
    };
  } catch (error) {
    // Clean up the newly created file if entry update fails.
    await fs.unlink(filePath).catch(() => {});
    await fs.rmdir(componentDir).catch(() => {});
    throw error;
  }
};

// =====================================================
// HELPER: REMOVE COMPONENT FILE AND EXPORT
// =====================================================

const removeComponentFile = async (file) => {
  if (!file) return;

  try {
    await fs.unlink(file.filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("File removal error:", error);
    }
  }

  try {
    const existingContent = await fs.readFile(
      LIBRARY_ENTRY_FILE,
      "utf8"
    );

    const updatedContent = existingContent
      .split("\n")
      .filter(
        (line) => line.trim() !== file.exportStatement
      )
      .join("\n");

    await fs.writeFile(
      LIBRARY_ENTRY_FILE,
      updatedContent,
      "utf8"
    );
  } catch (error) {
    console.error("Export removal error:", error);
  }

  try {
    await fs.rmdir(file.componentDir);
  } catch {
    // Leave non-empty folders untouched.
  }
};

// =====================================================
// HELPER: BUILD PIXELAI LIBRARY
// Regenerates dist files from src
// =====================================================

const buildLibrary = async () => {
  await execAsync("npm run build", {
    cwd: PIXELAI_LIB_DIR,
  });
};

// =====================================================
// HELPER: GET LOGGED-IN USER
// =====================================================

const getLoggedInUser = async (req) => {
  if (!req.userId) return null;

  return await User.findById(req.userId);
};

// =====================================================
// HELPER: CHECK ADMIN ROLE
// =====================================================

const checkAdmin = async (req, res) => {
  const user = await getLoggedInUser(req);

  if (!user) {
    res.status(404).json({
      message: "User not found",
    });

    return false;
  }

  if (user.role !== "admin") {
    res.status(403).json({
      message: "Only admin can perform this action",
    });

    return false;
  }

  return user;
};

// =====================================================
// SAVE COMPONENT
//
// 1. Normalize generated code.
// 2. Create component folder and JSX file.
// 3. Add export to src/index.js.
// 4. Build library.
// 5. Save normalized code in MongoDB.
// =====================================================

export const saveComponent = async (req, res) => {
  let createdFile = null;
  let savedComponent = null;
  let libraryBuildAttempted = false;

  try {
    // Get logged-in user (Admin or User)
    const user = await getLoggedInUser(req);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      name,
      description = "",
      category,
      prompt = "",
      code,
      props = [],
      visibility = "private",
    } = req.body;

    // Validate visibility
    if (!["public", "private"].includes(visibility)) {
      return res.status(400).json({
        success: false,
        message: "Visibility must be public or private",
      });
    }

    // Normal users can only save private components
    if (user.role === "user" && visibility !== "private") {
      return res.status(403).json({
        success: false,
        message: "Users can only save private components",
      });
    }

    // Validate props
    if (!Array.isArray(props)) {
      return res.status(400).json({
        success: false,
        message: "Props must be an array",
      });
    }

    // Validate required fields
    if (
      !name ||
      !category ||
      !code ||
      typeof name !== "string" ||
      typeof category !== "string" ||
      typeof code !== "string" ||
      !name.trim() ||
      !category.trim() ||
      !code.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid name, category and code are required",
      });
    }

    // Normalize generated code
    const componentName = createFileName(name);

    const normalizedCode = normalizeComponentCode(
      code,
      componentName
    );

    let finalCode = normalizedCode;
    let fileName = null;
    let libraryComponentName = null;
    let filePath = null;

    // ============================================
    // ADMIN: Save to library files + build
    // USER: Save privately in MongoDB only
    // ============================================

    if (user.role === "admin") {
      createdFile = await createComponentFile(
        componentName,
        normalizedCode
      );

      libraryBuildAttempted = true;
      await buildLibrary();

      finalCode = createdFile.finalCode;
      fileName = createdFile.fileName;
      libraryComponentName = createdFile.componentName;
      filePath = path.relative(
        PIXELAI_LIB_DIR,
        createdFile.filePath
      );
    }

    // Save component in MongoDB
    savedComponent = await Component.create({
      name: name.trim(),
      description,
      category,
      prompt,
      code: finalCode,
      props,
      owner: user._id,
      visibility: user.role === "user" ? "private" : visibility,
    });

    return res.status(201).json({
      success: true,
      message:
        user.role === "admin"
          ? "Component saved and library built successfully"
          : "Component saved successfully",
      component: savedComponent,
      fileName,
      componentName: libraryComponentName,
      filePath,
    });
  } catch (error) {
    console.error("Save component error:", error);

    // Rollback library file if saving/building failed
    if (createdFile && !savedComponent) {
      await removeComponentFile(createdFile);

      if (libraryBuildAttempted) {
        try {
          await buildLibrary();
        } catch (buildError) {
          console.error("Rollback build error:", buildError);
        }
      }
    }

    return res.status(500).json({
      success: false,
      message: `Save component error: ${error.message}`,
    });
  }
};
// =====================================================
// CREATE COMPONENT
// =====================================================

export const createComponent = saveComponent;

// =====================================================
// GET ALL PUBLISHED COMPONENTS
// =====================================================

export const getAllComponents = async (req, res) => {
  try {
    const components = await Component.find({
      visibility: "public",
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      components,
    });
  } catch (error) {
    console.error("Get components error:", error);

    return res.status(500).json({
      message: `Get components error: ${error.message}`,
    });
  }
};
// =====================================================
// GET SINGLE COMPONENT
// =====================================================
// =====================================================
// GET MY PRIVATE COMPONENTS
// =====================================================
export const getMyComponents = async (req, res) => {
  try {
    const userId = req.userId;

    const components = await Component.find({
      owner: userId,
      visibility: "private",
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      components,
    });
  } catch (error) {
    console.error("Get My Components Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your components",
    });
  }
};
export const getComponentById = async (req, res) => {
  try {
    const { id } = req.params;

    const component = await Component.findById(id).populate(
      "owner",
      "name email"
    );

    if (!component) {
      return res.status(404).json({
        message: "Component not found",
      });
    }

    return res.status(200).json({
      component,
    });

  } catch (error) {
    console.error("Get component error:", error);

    return res.status(500).json({
      message: `Get component error: ${error.message}`,
    });
  }
};

// =====================================================
// UPDATE COMPONENT
// Only creator or admin can update
// NOTE: This updates MongoDB only.
// =====================================================

export const updateComponent = async (req, res) => {
  try {
    const { id } = req.params;

    const component = await Component.findById(id);

    if (!component) {
      return res.status(404).json({
        message: "Component not found",
      });
    }

    const user = await getLoggedInUser(req);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isCreator =
      component.owner?.toString() === user._id.toString();

    const isAdmin = user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to update this component",
      });
    }

    const {
      name,
      description,
      category,
      prompt,
      code,
    } = req.body;

    const updatedComponent = await Component.findByIdAndUpdate(
      id,
      {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(prompt !== undefined && { prompt }),
        ...(code !== undefined && { code }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Component updated successfully",
      component: updatedComponent,
    });

  } catch (error) {
    console.error("Update component error:", error);

    return res.status(500).json({
      message: `Update component error: ${error.message}`,
    });
  }
};

// =====================================================
// DELETE COMPONENT
// Only creator or admin can delete
// NOTE: This deletes MongoDB record only.
// =====================================================

export const deleteComponent = async (req, res) => {
  try {
    const { id } = req.params;

    const component = await Component.findById(id);

    if (!component) {
      return res.status(404).json({
        message: "Component not found",
      });
    }

    const user = await getLoggedInUser(req);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isCreator =
      component.owner?.toString() === user._id.toString();

    const isAdmin = user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to delete this component",
      });
    }

    await Component.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Component deleted successfully",
    });

  } catch (error) {
    console.error("Delete component error:", error);

    return res.status(500).json({
      message: `Delete component error: ${error.message}`,
    });
  }
};

// =====================================================
// PUBLISH COMPONENT
// Only admin can publish
// =====================================================

export const publishComponent = async (req, res) => {
  try {
    const admin = await checkAdmin(req, res);

    if (!admin) return;

    const { id } = req.params;

    const component = await Component.findById(id);

    if (!component) {
      return res.status(404).json({
        message: "Component not found",
      });
    }

    if (component.visibility === "public") {
      return res.status(400).json({
        message: "Component is already published",
      });
    }

    component.visibility = "public";

    await component.save();

    return res.status(200).json({
      message: "Component published successfully",
      component,
    });

  } catch (error) {
    console.error("Publish component error:", error);

    return res.status(500).json({
      message: `Publish component error: ${error.message}`,
    });
  }
};

// =====================================================
// GENERATE COMPONENT USING AI
// Generation returns normalized code.
// Saving happens separately through saveComponent.
// =====================================================

export const generateComponent = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate prompt.
    if (
      !prompt ||
      typeof prompt !== "string" ||
      !prompt.trim()
    ) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    // Get logged-in user.
    const user = await getLoggedInUser(req);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check AI credits.
    if (user.role === "user" && user.aiCredits < 50) {
      return res.status(400).json({
        message: "Not enough AI credits",
      });
    }

    // AI system prompt.
    const systemPrompt = `
You are PixelAI, an expert React UI component generator.

Generate production-ready React UI components based on the user's prompt.

OUTPUT FORMAT:
Return ONLY valid JSON with this structure:

{
  "name": "Component name",
  "description": "Short description",
  "category": "Component category",
  "code": "Complete React JSX code"
}

Rules:
- Return valid JSON only.
- Do not use Markdown or code fences.
- Do not add explanations outside JSON.
- name and description must be short and meaningful.
- category must be one of:
  Navbar, Hero, Button, Card, Form, Modal, Dashboard,
  Table, Footer, Authentication, Other.
- code must contain the complete React JSX component.

CODE RULES:
1. Use modern React functional components.
2. Use JSX.
3. Use Tailwind CSS.
4. Do not use plain CSS files.
5. Avoid inline CSS unless necessary.
6. Do not use Bootstrap, Material UI, Ant Design or Chakra UI.
7. Make components responsive for mobile, tablet and desktop.
8. Use semantic HTML.
9. Follow accessibility best practices.
10. Do not include TODO comments.
11. Do not leave unfinished functions.
12. Do not use undefined variables or fake imports.
13. Use lucide-react icons only when required.
14. Do not generate backend code.
15. Do not generate separate HTML, CSS or JS files.
16. The code field must contain only React component code.
17. Make the component directly usable in a React project.
18. Keep the code reasonably concise.
19. Do not put explanations inside generated code.

COMPONENT EXPORT RULES:
20. Generate one main React component.
21. Use a named function or const declaration for the main component.
22. The main component must start with an uppercase letter.
23. Do not use ReactDOM.render().
24. Do not use createRoot().
25. Do not mount or render the application yourself.
26. Do not include ReactDOM or root mounting code.
27. Do not include a separate HTML document.
28. Do not include multiple default exports.
29. Do not use export statements for helper components.
30. The main component must be compatible with a default export.
31. Do not include an unnecessary React import.
32. Import hooks from React when you use them, for example:
    import { useState } from "react";
33. Do not use undefined imports or variables.
34. Always ensure JSX components work with the classic React JSX runtime.
35. Include import React from "react" when using JSX.
36. Do not use ReactDOM.render() or createRoot().
37. Export the main component as default.
38. Do not assume React is globally available.

- Never call render() as a standalone function.
- Never use ReactDOM.render().
- Never use createRoot().
- Never include application mounting code.
- Never use an undefined render variable.
- Do not include code outside the main React component.
- Return only the component implementation and its imports.

The backend will automatically add the default export if it is missing.

DESIGN RULES:
Create a modern, clean and professional UI.

Use:
- Clear headings and supporting text.
- Clear primary actions.
- Good spacing and balanced layouts.
- Responsive mobile-first design.
- Neutral colors with one accent color.
- Proper typography hierarchy.
- Subtle shadows and borders.
- rounded-lg and rounded-xl.
- p-4, p-6, p-8, gap-4 and gap-6.
- Hover, focus and disabled states for buttons.
- Labels, borders and focus styles for inputs.

Avoid:
- Excessive rounded-full styling.
- Too many gradients.
- Horizontal overflow.
- Unnecessary dependencies.

LIVE PREVIEW RULES:
Every generated component must work independently inside PixelAI's live preview.

The component must:
- Render independently.
- Not require backend APIs.
- Use static/mock data when required.
- Not require environment variables or authentication.
- Not make API calls unless explicitly requested.
- Not contain undefined props.
- Provide default values when props are required.
- Have one clear root component.
- Work directly in the PixelAI preview system.
- Use React state for interactive elements.
- Use local state for forms.
- Use mock data for dashboards, tables, charts and lists.
- Avoid browser-specific APIs unless required.
- Avoid console errors.

SUPPORTED COMPONENT EXAMPLES:
- Button: Modern gradient button with hover animation.
- Login Form: Dark email/password login form.
- Navbar: Responsive SaaS navbar.
- Hero Section: SaaS hero with heading, description and CTA buttons.
- Product Card: Product image, title, price, rating and action.
- Dashboard: Sidebar, statistics and recent orders using mock data.
- Modal: Delete confirmation modal.
- Pricing Cards: Free, Pro and Enterprise plans.
- Table: User management table.
- Profile Card: Developer profile with avatar and skills.
- Sidebar: Dark admin sidebar.
- Component Gallery: Grid of buttons, cards and inputs.

IMPORTANT:
The generated component must be polished, responsive, reusable,
ready to copy, valid JSON and suitable for live preview.

Return ONLY JSON.
`;

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: prompt.trim(),
      },
    ];

    // Ask AI.
    const aiResponse = await askAI(messages);

    if (
      !aiResponse ||
      typeof aiResponse !== "string"
    ) {
      return res.status(500).json({
        message: "AI returned an empty response",
      });
    }

    // Parse AI JSON response.
    let parsed;

    try {
      const cleanResponse = aiResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(cleanResponse);

    } catch (error) {
      console.error("AI JSON Parse Error:", error);
      console.error("Raw AI Response:", aiResponse);

      return res.status(500).json({
        message: "AI returned invalid JSON",
      });
    }

    // Validate AI-generated data.
    if (
      !parsed.name ||
      !parsed.description ||
      !parsed.category ||
      !parsed.code ||
      typeof parsed.name !== "string" ||
      typeof parsed.description !== "string" ||
      typeof parsed.category !== "string" ||
      typeof parsed.code !== "string"
    ) {
      return res.status(500).json({
        message: "AI returned incomplete component data",
      });
    }

    // Normalize generated component code.
    const componentName = createFileName(parsed.name);

    const normalizedCode = normalizeComponentCode(
      parsed.code,
      componentName
    );

    // Replace raw AI code with normalized code.
    parsed.code = normalizedCode;

    // Deduct credits only after successful generation
    // and successful code normalization.
    if (user.role === "user") {
      user.aiCredits -= 50;
      await user.save();
    }

    return res.status(200).json({
      message: "Component generated successfully",
      component: parsed,
      remainingCredits:
        user.role === "user" ? user.aiCredits : null,
    });

  } catch (error) {
    console.error("Generate component error:", error);

    return res.status(500).json({
      message: `Generate component error: ${error.message}`,
    });
  }
};


