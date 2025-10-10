#!/bin/bash

# 修复语法错误

cd frontends/dev

# 修复csv-converter.ts
sed -i '' 's/  }$/  }\
\
  getLocalizedContent(language: '\''zh'\'' | '\''en'\'') {\
    if (language === '\''en'\'') {\
      return {\
        name: this.name,\
        description: this.description,\
        inputPlaceholder: this.inputPlaceholder || "Please enter content...",\
        options: [],\
      };\
    }\
    \
    return {\
      name: this.name,\
      description: this.description,\
      inputPlaceholder: this.inputPlaceholder || "请输入内容...",\
      options: [],\
    };\
  }/' src/lib/tools/csv-converter.ts

# 修复file-size-calculator.ts
sed -i '' 's/  }$/  }\
\
  getLocalizedContent(language: '\''zh'\'' | '\''en'\'') {\
    if (language === '\''en'\'') {\
      return {\
        name: this.name,\
        description: this.description,\
        inputPlaceholder: this.inputPlaceholder || "Please enter content...",\
        options: [],\
      };\
    }\
    \
    return {\
      name: this.name,\
      description: this.description,\
      inputPlaceholder: this.inputPlaceholder || "请输入内容...",\
      options: [],\
    };\
  }/' src/lib/tools/file-size-calculator.ts

# 修复json-validator.ts
sed -i '' 's/  }$/  }\
\
  getLocalizedContent(language: '\''zh'\'' | '\''en'\'') {\
    if (language === '\''en'\'') {\
      return {\
        name: this.name,\
        description: this.description,\
        inputPlaceholder: this.inputPlaceholder || "Please enter content...",\
        options: [],\
      };\
    }\
    \
    return {\
      name: this.name,\
      description: this.description,\
      inputPlaceholder: this.inputPlaceholder || "请输入内容...",\
      options: [],\
    };\
  }/' src/lib/tools/json-validator.ts

# 修复lorem-generator.ts
sed -i '' 's/  }$/  }\
\
  getLocalizedContent(language: '\''zh'\'' | '\''en'\'') {\
    if (language === '\''en'\'') {\
      return {\
        name: this.name,\
        description: this.description,\
        inputPlaceholder: this.inputPlaceholder || "Please enter content...",\
        options: [],\
      };\
    }\
    \
    return {\
      name: this.name,\
      description: this.description,\
      inputPlaceholder: this.inputPlaceholder || "请输入内容...",\
      options: [],\
    };\
  }/' src/lib/tools/lorem-generator.ts

# 修复markdown-converter.ts
sed -i '' 's/  }$/  }\
\
  getLocalizedContent(language: '\''zh'\'' | '\''en'\'') {\
    if (language === '\''en'\'') {\
      return {\
        name: this.name,\
        description: this.description,\
        inputPlaceholder: this.inputPlaceholder || "Please enter content...",\
        options: [],\
      };\
    }\
    \
    return {\
      name: this.name,\
      description: this.description,\
      inputPlaceholder: this.inputPlaceholder || "请输入内容...",\
      options: [],\
    };\
  }/' src/lib/tools/markdown-converter.ts

echo "✅ 语法错误修复完成！"
