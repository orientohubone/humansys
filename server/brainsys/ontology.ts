
import { z } from 'zod';

// Entidades fundamentais do domínio organizacional
export const EntityType = z.enum([
  'USER',
  'COLLABORATOR', 
  'TEAM',
  'DEPARTMENT',
  'GOAL',
  'TASK',
  'SKILL',
  'BEHAVIOR',
  'INTERACTION',
  'DECISION',
  'CONTEXT',
  'SIGNAL'
]);

export const SignalType = z.enum([
  'ENGAGEMENT',
  'PERFORMANCE',
  'SATISFACTION',
  'STRESS',
  'COLLABORATION',
  'INNOVATION',
  'LEADERSHIP',
  'LEARNING',
  'ADAPTATION',
  'FEEDBACK',
  'GROWTH',
  'RISK'
]);

export const RelationType = z.enum([
  'BELONGS_TO',
  'MANAGES',
  'COLLABORATES_WITH',
  'DEPENDS_ON',
  'INFLUENCES',
  'LEARNS_FROM',
  'MENTORS',
  'CREATES',
  'CONSUMES',
  'TRANSFORMS',
  'PREDICTS',
  'CORRELATES_WITH'
]);

export const DecisionContext = z.enum([
  'RECRUITMENT',
  'PERFORMANCE_REVIEW',
  'TEAM_FORMATION',
  'SKILL_DEVELOPMENT',
  'CAREER_PATH',
  'ENGAGEMENT_BOOST',
  'STRESS_MITIGATION',
  'INNOVATION_CATALYST',
  'LEADERSHIP_DEVELOPMENT',
  'CULTURE_ALIGNMENT'
]);

// Schemas para entidades ontológicas
export const EntitySchema = z.object({
  id: z.string().uuid(),
  type: EntityType,
  name: z.string(),
  properties: z.record(z.any()),
  metadata: z.object({
    created_at: z.date(),
    updated_at: z.date(),
    confidence: z.number().min(0).max(1),
    relevance: z.number().min(0).max(1)
  })
});

export const RelationSchema = z.object({
  id: z.string().uuid(),
  type: RelationType,
  source_entity: z.string().uuid(),
  target_entity: z.string().uuid(),
  strength: z.number().min(0).max(1),
  properties: z.record(z.any()),
  metadata: z.object({
    created_at: z.date(),
    updated_at: z.date(),
    confidence: z.number().min(0).max(1),
    temporal_weight: z.number().min(0).max(1)
  })
});

export const SignalSchema = z.object({
  id: z.string().uuid(),
  type: SignalType,
  entity_id: z.string().uuid(),
  value: z.number(),
  context: DecisionContext,
  properties: z.record(z.any()),
  metadata: z.object({
    timestamp: z.date(),
    source: z.string(),
    confidence: z.number().min(0).max(1),
    impact_score: z.number().min(0).max(1)
  })
});

export const OntologyDomain = z.object({
  entities: z.array(EntitySchema),
  relations: z.array(RelationSchema),
  signals: z.array(SignalSchema)
});

// Tipos TypeScript derivados
export type Entity = z.infer<typeof EntitySchema>;
export type Relation = z.infer<typeof RelationSchema>;
export type Signal = z.infer<typeof SignalSchema>;
export type OntologyGraph = z.infer<typeof OntologyDomain>;

// Classes para manipulação ontológica
export class OntologyEngine {
  private entities: Map<string, Entity> = new Map();
  private relations: Map<string, Relation> = new Map();
  private entityRelations: Map<string, string[]> = new Map();

  addEntity(entity: Entity): void {
    this.entities.set(entity.id, entity);
    if (!this.entityRelations.has(entity.id)) {
      this.entityRelations.set(entity.id, []);
    }
  }

  addRelation(relation: Relation): void {
    this.relations.set(relation.id, relation);
    
    // Atualizar índices bidirecionais
    if (!this.entityRelations.has(relation.source_entity)) {
      this.entityRelations.set(relation.source_entity, []);
    }
    if (!this.entityRelations.has(relation.target_entity)) {
      this.entityRelations.set(relation.target_entity, []);
    }
    
    this.entityRelations.get(relation.source_entity)!.push(relation.id);
    this.entityRelations.get(relation.target_entity)!.push(relation.id);
  }

  getEntityNeighbors(entityId: string): Entity[] {
    const relationIds = this.entityRelations.get(entityId) || [];
    const neighbors: Entity[] = [];
    
    for (const relationId of relationIds) {
      const relation = this.relations.get(relationId);
      if (relation) {
        const neighborId = relation.source_entity === entityId 
          ? relation.target_entity 
          : relation.source_entity;
        const neighbor = this.entities.get(neighborId);
        if (neighbor) neighbors.push(neighbor);
      }
    }
    
    return neighbors;
  }

  findStrongestRelations(entityId: string, limit: number = 5): Relation[] {
    const relationIds = this.entityRelations.get(entityId) || [];
    const relations = relationIds
      .map(id => this.relations.get(id))
      .filter(Boolean) as Relation[];
    
    return relations
      .sort((a, b) => b.strength - a.strength)
      .slice(0, limit);
  }

  calculateEntityInfluence(entityId: string): number {
    const relations = this.entityRelations.get(entityId) || [];
    let influence = 0;
    
    for (const relationId of relations) {
      const relation = this.relations.get(relationId);
      if (relation) {
        influence += relation.strength * relation.metadata.confidence;
      }
    }
    
    return Math.min(influence, 1);
  }

  // Busca semântica baseada em propriedades
  findSimilarEntities(targetEntity: Entity, threshold: number = 0.7): Entity[] {
    const similar: Entity[] = [];
    
    for (const [id, entity] of this.entities) {
      if (id === targetEntity.id) continue;
      
      const similarity = this.calculateSimilarity(targetEntity, entity);
      if (similarity >= threshold) {
        similar.push(entity);
      }
    }
    
    return similar.sort((a, b) => 
      this.calculateSimilarity(targetEntity, b) - 
      this.calculateSimilarity(targetEntity, a)
    );
  }

  private calculateSimilarity(entityA: Entity, entityB: Entity): number {
    if (entityA.type !== entityB.type) return 0;
    
    // Similaridade baseada em propriedades compartilhadas
    const propsA = Object.keys(entityA.properties);
    const propsB = Object.keys(entityB.properties);
    const intersection = propsA.filter(prop => propsB.includes(prop));
    const union = new Set([...propsA, ...propsB]);
    
    return intersection.length / union.size;
  }

  exportGraph(): OntologyGraph {
    return {
      entities: Array.from(this.entities.values()),
      relations: Array.from(this.relations.values()),
      signals: [] // Sinais são gerenciados pelo sistema de memória
    };
  }
}

// Fábrica de entidades especializadas
export class EntityFactory {
  static createUser(userId: string, userData: any): Entity {
    return {
      id: userId,
      type: 'USER',
      name: userData.full_name || userData.email,
      properties: {
        email: userData.email,
        role: userData.role || 'user',
        department: userData.department,
        skills: userData.skills || [],
        preferences: userData.preferences || {}
      },
      metadata: {
        created_at: new Date(),
        updated_at: new Date(),
        confidence: 0.9,
        relevance: 1.0
      }
    };
  }

  static createBehavior(behaviorId: string, behaviorData: any): Entity {
    return {
      id: behaviorId,
      type: 'BEHAVIOR',
      name: behaviorData.name,
      properties: {
        pattern: behaviorData.pattern,
        frequency: behaviorData.frequency,
        context: behaviorData.context,
        triggers: behaviorData.triggers || []
      },
      metadata: {
        created_at: new Date(),
        updated_at: new Date(),
        confidence: behaviorData.confidence || 0.7,
        relevance: behaviorData.relevance || 0.8
      }
    };
  }

  static createTeam(teamId: string, teamData: any): Entity {
    return {
      id: teamId,
      type: 'TEAM',
      name: teamData.name,
      properties: {
        members: teamData.members || [],
        goals: teamData.goals || [],
        performance_metrics: teamData.performance_metrics || {},
        collaboration_patterns: teamData.collaboration_patterns || {}
      },
      metadata: {
        created_at: new Date(),
        updated_at: new Date(),
        confidence: 0.8,
        relevance: 0.9
      }
    };
  }
}
