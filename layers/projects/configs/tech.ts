import type { ProjectTechBubble, ProjectTechRing } from '@l-projects/types';

import ReactLogo from '@l-projects/assets/images/tech/react.svg?url';
import KubernetesLogo from '@l-projects/assets/images/tech/kubernetes.svg?url';
import GolangLogo from '@l-projects/assets/images/tech/golang.svg?url';
import PostgresqlLogo from '@l-projects/assets/images/tech/postgresql.svg?url';
import KafkaLogo from '@l-projects/assets/images/tech/kafka.svg?url';
import RedisLogo from '@l-projects/assets/images/tech/redis.svg?url';
import JavaLogo from '@l-projects/assets/images/tech/java.svg?url';
import SpringLogo from '@l-projects/assets/images/tech/spring.png';
import NodejsLogo from '@l-projects/assets/images/tech/nodejs.svg?url';
import MongodbLogo from '@l-projects/assets/images/tech/mongodb.svg?url';
import PythonLogo from '@l-projects/assets/images/tech/python.svg?url';
import AwsLogo from '@l-projects/assets/images/tech/aws.svg?url';
import TensorflowLogo from '@l-projects/assets/images/tech/tensorflow.svg?url';
import DjangoLogo from '@l-projects/assets/images/tech/django.svg?url';
import IotLogo from '@l-projects/assets/images/tech/iot.svg?url';

/** Кольцо сцены; double — в макете слой продублирован, кольцо вдвое плотнее */
export type TechRing = ProjectTechRing & { double?: boolean };

// Кольца сцены технологий: у кейсов с шестью пузырями своя раскладка.
// В широкой раскладке макета каждое кольцо лежит двумя слоями, в компактной — одним

const RINGS_WIDE: TechRing[] = [
  { size: 518, x: 984, y: -80, double: true },
  { size: 280, x: 51, y: -26, double: true },
  { size: 227, x: 658, y: 195, double: true },
];

const RINGS_COMPACT: TechRing[] = [
  { size: 473, x: 995, y: -167 },
  { size: 313, x: 245, y: 153.5 },
];

/** Сцены технологий по кейсам: позиции сняты с макета (сцена 1320x487).
 * Логотипы — символы «logo ...» из макета, по ховеру виден каждый */
export const PROJECT_TECH: Record<string, { bubbles: ProjectTechBubble[]; rings: TechRing[] }> = {
  kassir: {
    bubbles: [
      { label: 'Golang', size: 300, x: 0, y: 65, logo: GolangLogo },
      { label: 'PostgreSQL', size: 288, x: 842, y: 179, logo: PostgresqlLogo },
      { label: 'Kafka', size: 243, x: 663, y: 30, logo: KafkaLogo },
      { label: 'Redis', size: 220, x: 289, y: 31, logo: RedisLogo },
      { label: 'React', size: 266, x: 1054, y: 0, logo: ReactLogo },
      { label: 'Kubernetes', size: 243, x: 459, y: 162, logo: KubernetesLogo },
    ],
    rings: RINGS_WIDE,
  },
  gazprom: {
    bubbles: [
      { label: 'Spring Boot', size: 300, x: 0, y: 65, logo: SpringLogo },
      { label: 'React', size: 288, x: 842, y: 179, logo: ReactLogo },
      { label: 'Kafka', size: 243, x: 663, y: 30, logo: KafkaLogo },
      { label: 'Java', size: 220, x: 289, y: 31, logo: JavaLogo },
      { label: 'IoT', size: 266, x: 1054, y: 0, logo: IotLogo },
      { label: 'PostgreSQL', size: 243, x: 459, y: 162, logo: PostgresqlLogo },
    ],
    rings: RINGS_WIDE,
  },
  zaslon: {
    bubbles: [
      { label: 'Apache Kafka', size: 318, x: 0, y: 35, logo: KafkaLogo },
      { label: 'React', size: 318, x: 783, y: 0, logo: ReactLogo },
      { label: 'Java', size: 243, x: 315, y: 30, logo: JavaLogo },
      { label: 'PostgreSQL', size: 266, x: 1054, y: 186, logo: PostgresqlLogo },
      { label: 'Spring Boot', size: 325, x: 501, y: 162, logo: SpringLogo },
    ],
    rings: RINGS_COMPACT,
  },
  bmw: {
    bubbles: [
      { label: 'Node.js', size: 318, x: 0, y: 35, logo: NodejsLogo },
      { label: 'Kubernetes', size: 318, x: 783, y: 0, logo: KubernetesLogo },
      { label: 'React', size: 243, x: 315, y: 30, logo: ReactLogo },
      { label: 'Redis', size: 266, x: 1054, y: 186, logo: RedisLogo },
      { label: 'MongoDB', size: 325, x: 501, y: 162, logo: MongodbLogo },
    ],
    rings: RINGS_COMPACT,
  },
  k31: {
    bubbles: [
      { label: 'Python', size: 318, x: 0, y: 35, logo: PythonLogo },
      { label: 'PostgreSQL', size: 318, x: 783, y: 0, logo: PostgresqlLogo },
      { label: 'AWS', size: 243, x: 315, y: 30, logo: AwsLogo },
      { label: 'Redis', size: 266, x: 1054, y: 186, logo: RedisLogo },
      { label: 'TensorFlow', size: 325, x: 501, y: 162, logo: TensorflowLogo },
    ],
    rings: RINGS_COMPACT,
  },
  university: {
    bubbles: [
      { label: 'Python', size: 318, x: 0, y: 35, logo: PythonLogo },
      { label: 'PostgreSQL', size: 318, x: 783, y: 0, logo: PostgresqlLogo },
      { label: 'Django', size: 243, x: 315, y: 30, logo: DjangoLogo },
      { label: 'React', size: 266, x: 1054, y: 186, logo: ReactLogo },
      { label: 'TensorFlow', size: 325, x: 501, y: 162, logo: TensorflowLogo },
    ],
    rings: RINGS_COMPACT,
  },
};
