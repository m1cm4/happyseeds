import { describe, it, expect, vi, beforeEach } from "vitest";

// On va mocker le module db
vi.mock("../db", () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { db } from "../db";
import { plantService } from "./plant.service";

// Données de test
const mockPlant = {
  id: "plant-123",
  authorId: "user-456",
  name: "Tomate",
  latinName: "Solanum lycopersicum",
  category: "vegetable" as const,
  description: "Délicieuse tomate rouge",
  sowingDepthMm: 5,
  sowingSpacingCm: 50,
  germinationDaysMin: 5,
  germinationDaysMax: 10,
  growthDaysMin: 60,
  growthDaysMax: 80,
  sunRequirement: "full_sun" as const,
  waterRequirement: "medium" as const,
  notes: null,
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("plantService", () => {
  beforeEach(() => {
    // Reset tous les mocks avant chaque test
    vi.clearAllMocks();
  });

  // ==========================================
  // Tests pour findById
  // ==========================================
  describe("findById", () => {
    it("devrait retourner une plante si elle existe (lecture publique)", async () => {
      // Arrange : configurer le mock
      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockPlant]),
          }),
        }),
      });
      (db.select as any).mockImplementation(mockSelect);

      // Act
      const result = await plantService.findById("plant-123");

      // Assert
      expect(result).toEqual(mockPlant);
      expect(db.select).toHaveBeenCalled();
    });

    it("devrait retourner null si la plante n'existe pas", async () => {
      // Arrange
      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });
      (db.select as any).mockImplementation(mockSelect);

      // Act
      const result = await plantService.findById("inexistant");

      // Assert
      expect(result).toBeNull();
    });
  });

  // ==========================================
  // Tests pour create
  // ==========================================
  describe("create", () => {
    it("devrait créer une plante et la retourner", async () => {
      // Arrange
      const newPlantData = {
        authorId: "user-456",
        commonName: "Carotte",
        category: "vegetable" as const,
        hardiness: "perennial" as const,
      };

      const createdPlant = { ...mockPlant, ...newPlantData, id: "new-id" };

      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([createdPlant]),
        }),
      });
      (db.insert as any).mockImplementation(mockInsert);

      // Act
      const result = await plantService.create(newPlantData);

      // Assert
      expect(result).toEqual(createdPlant);
      expect(db.insert).toHaveBeenCalled();
    });
  });

  // ==========================================
  // Tests pour update
  // ==========================================
  describe("update", () => {
    it("devrait mettre à jour une plante existante", async () => {
      // Arrange
      const updatedPlant = { ...mockPlant, name: "Tomate cerise" };

      const mockUpdate = vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([updatedPlant]),
          }),
        }),
      });
      (db.update as any).mockImplementation(mockUpdate);

      // Act
      const result = await plantService.update("plant-123", "user-456", {
        commonName: "Tomate cerise",
      });

      // Assert
      expect(result).toEqual(updatedPlant);
      expect(result?.commonName).toBe("Tomate cerise");
    });

    it("devrait retourner null si la plante n'existe pas", async () => {
      // Arrange
      const mockUpdate = vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      });
      (db.update as any).mockImplementation(mockUpdate);

      // Act
      const result = await plantService.update("inexistant", "user-456", {
        commonName: "Test",
      });

      // Assert
      expect(result).toBeNull();
    });
  });

  // ==========================================
  // Tests pour delete
  // ==========================================
  describe("delete", () => {
    it("devrait retourner true si la suppression a réussi", async () => {
      // Arrange
      const mockDelete = vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: "plant-123" }]),
        }),
      });
      (db.delete as any).mockImplementation(mockDelete);

      // Act
      const result = await plantService.delete("plant-123", "user-456");

      // Assert
      expect(result).toBe(true);
    });

    it("devrait retourner false si la plante n'existe pas", async () => {
      // Arrange
      const mockDelete = vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      });
      (db.delete as any).mockImplementation(mockDelete);

      // Act
      const result = await plantService.delete("inexistant", "user-456");

      // Assert
      expect(result).toBe(false);
    });
  });
});
