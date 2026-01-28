import { slugify, truncate } from "./string.utils";

describe("string.utils", () => {
  // ==========================================
  // Tests pour slugify
  // ==========================================
  describe("slugify", () => {
    it("devrait convertir en minuscule", () => {
      // Arrange
      const input = "HELLOWORLD";

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("helloworld");
    });

    it("devrait remplacer espaces par des tirets", () => {
      const result = slugify("hello world");
      expect(result).toBe("hello-world");
    });

    it("devrait supprimer les accents", () => {
      const result = slugify("Café crème brûlée");
      expect(result).toBe("cafe-creme-brulee");
    });

    it("devrait supprimer les caractères spéciaux", () => {
      const result = slugify("Hello! How are you?");
      expect(result).toBe("hello-how-are-you");
    });

    it("devrait gérer les tirets multiples", () => {
      const result = slugify("hello   world");
      expect(result).toBe("hello-world");
    });

    it("devrait retourner une chaîne vide pour une entrée vide", () => {
      const result = slugify("");
      expect(result).toBe("");
    });
  });

  // ==========================================
  // Tests pour truncate
  // ==========================================
  describe("truncate", () => {
    it("devrait retourner la chaîne intacte si elle est plus courte que maxLength", () => {
      const result = truncate("Hello", 10);
      expect(result).toBe("Hello");
    });

    it("devrait retourner la chaîne intacte si elle fait exactement maxLength", () => {
      const result = truncate("Hello", 5);
      expect(result).toBe("Hello");
    });

    it("devrait tronquer et ajouter ... si la chaîne est trop longue", () => {
      const result = truncate("Hello World", 8);
      // maxLength = 8, donc on garde 5 caractères + "..."
      expect(result).toBe("Hello...");
    });

    it("devrait gérer maxLength très petit", () => {
      const result = truncate("Hello", 4);
      // 4 - 3 = 1 caractère + "..."
      expect(result).toBe("H...");
    });
  });
});