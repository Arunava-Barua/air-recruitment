"use client"

import { useRef, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type * as THREE from "three"

// Disease color mapping
const diseaseColors = {
  // Infectious diseases - Red spectrum
  Malaria: "#EF4444",
  Dengue: "#DC2626",
  Tuberculosis: "#B91C1C",
  "HIV/AIDS": "#991B1B",
  Pneumonia: "#F87171",
  Typhoid: "#FCA5A5",

  // Cardiovascular - Blue spectrum
  Cardiovascular: "#3B82F6",
  Hypertension: "#2563EB",
  Stroke: "#1D4ED8",

  // Metabolic - Green spectrum
  Diabetes: "#10B981",
  Obesity: "#059669",
  Metabolic: "#047857",

  // Mental health - Purple spectrum
  Depression: "#8B5CF6",
  Anxiety: "#7C3AED",

  // Respiratory - Orange spectrum
  Respiratory: "#F59E0B",
  Asthma: "#D97706",

  // Cancer - Pink spectrum
  "Skin Cancer": "#EC4899",
  Cancer: "#DB2777",

  // Other - Yellow/Teal spectrum
  Arthritis: "#14B8A6",
  Malnutrition: "#F59E0B",

  // Default fallback
  default: "#6B7280",
}

// Comprehensive dummy data for global health credentials
const globalHealthData = [
  // Africa
  {
    id: 1,
    name: "Lagos, Nigeria",
    lat: 6.5244,
    lng: 3.3792,
    count: 2847,
    diseases: ["Malaria", "Hypertension", "Typhoid"],
    region: "West Africa",
    growth: "+15%",
    topMedicine: "Chloroquine",
    primaryDisease: "Malaria",
  },
  {
    id: 2,
    name: "Cairo, Egypt",
    lat: 30.0444,
    lng: 31.2357,
    count: 1923,
    diseases: ["Diabetes", "Cardiovascular", "Respiratory"],
    region: "North Africa",
    growth: "+8%",
    topMedicine: "Metformin",
    primaryDisease: "Diabetes",
  },
  {
    id: 3,
    name: "Nairobi, Kenya",
    lat: -1.2921,
    lng: 36.8219,
    count: 1456,
    diseases: ["Malaria", "Tuberculosis", "HIV/AIDS"],
    region: "East Africa",
    growth: "+22%",
    topMedicine: "Artemether",
    primaryDisease: "Malaria",
  },
  {
    id: 4,
    name: "Cape Town, South Africa",
    lat: -33.9249,
    lng: 18.4241,
    count: 1789,
    diseases: ["Hypertension", "Diabetes", "Depression"],
    region: "Southern Africa",
    growth: "+5%",
    topMedicine: "Lisinopril",
    primaryDisease: "Hypertension",
  },
  {
    id: 5,
    name: "Kinshasa, DRC",
    lat: -4.4419,
    lng: 15.2663,
    count: 987,
    diseases: ["Malaria", "Pneumonia", "Malnutrition"],
    region: "Central Africa",
    growth: "+18%",
    topMedicine: "Amoxicillin",
    primaryDisease: "Malaria",
  },

  // Asia
  {
    id: 6,
    name: "Mumbai, India",
    lat: 19.076,
    lng: 72.8777,
    count: 4521,
    diseases: ["Diabetes", "Hypertension", "Respiratory"],
    region: "South Asia",
    growth: "+12%",
    topMedicine: "Metformin",
    primaryDisease: "Diabetes",
  },
  {
    id: 7,
    name: "Beijing, China",
    lat: 39.9042,
    lng: 116.4074,
    count: 3876,
    diseases: ["Cardiovascular", "Diabetes", "Stroke"],
    region: "East Asia",
    growth: "+7%",
    topMedicine: "Aspirin",
    primaryDisease: "Cardiovascular",
  },
  {
    id: 8,
    name: "Jakarta, Indonesia",
    lat: -6.2088,
    lng: 106.8456,
    count: 2134,
    diseases: ["Dengue", "Tuberculosis", "Diabetes"],
    region: "Southeast Asia",
    growth: "+25%",
    topMedicine: "Paracetamol",
    primaryDisease: "Dengue",
  },
  {
    id: 9,
    name: "Bangkok, Thailand",
    lat: 13.7563,
    lng: 100.5018,
    count: 1687,
    diseases: ["Dengue", "Hypertension", "Diabetes"],
    region: "Southeast Asia",
    growth: "+14%",
    topMedicine: "ACE Inhibitors",
    primaryDisease: "Dengue",
  },

  // Europe
  {
    id: 10,
    name: "London, UK",
    lat: 51.5074,
    lng: -0.1278,
    count: 2456,
    diseases: ["Depression", "Cardiovascular", "Diabetes"],
    region: "Western Europe",
    growth: "+3%",
    topMedicine: "Sertraline",
    primaryDisease: "Depression",
  },
  {
    id: 11,
    name: "Berlin, Germany",
    lat: 52.52,
    lng: 13.405,
    count: 1834,
    diseases: ["Cardiovascular", "Depression", "Arthritis"],
    region: "Central Europe",
    growth: "+4%",
    topMedicine: "Simvastatin",
    primaryDisease: "Cardiovascular",
  },
  {
    id: 12,
    name: "Rome, Italy",
    lat: 41.9028,
    lng: 12.4964,
    count: 1567,
    diseases: ["Cardiovascular", "Diabetes", "Hypertension"],
    region: "Southern Europe",
    growth: "+6%",
    topMedicine: "Amlodipine",
    primaryDisease: "Cardiovascular",
  },

  // Americas
  {
    id: 13,
    name: "São Paulo, Brazil",
    lat: -23.5505,
    lng: -46.6333,
    count: 3245,
    diseases: ["Dengue", "Hypertension", "Diabetes"],
    region: "South America",
    growth: "+16%",
    topMedicine: "Losartan",
    primaryDisease: "Dengue",
  },
  {
    id: 14,
    name: "Mexico City, Mexico",
    lat: 19.4326,
    lng: -99.1332,
    count: 2789,
    diseases: ["Diabetes", "Hypertension", "Obesity"],
    region: "North America",
    growth: "+11%",
    topMedicine: "Metformin",
    primaryDisease: "Diabetes",
  },
  {
    id: 15,
    name: "New York, USA",
    lat: 40.7128,
    lng: -74.006,
    count: 3567,
    diseases: ["Depression", "Cardiovascular", "Diabetes"],
    region: "North America",
    growth: "+2%",
    topMedicine: "Atorvastatin",
    primaryDisease: "Depression",
  },
  {
    id: 16,
    name: "Buenos Aires, Argentina",
    lat: -34.6118,
    lng: -58.396,
    count: 1876,
    diseases: ["Cardiovascular", "Depression", "Hypertension"],
    region: "South America",
    growth: "+9%",
    topMedicine: "Enalapril",
    primaryDisease: "Cardiovascular",
  },

  // Oceania
  {
    id: 17,
    name: "Sydney, Australia",
    lat: -33.8688,
    lng: 151.2093,
    count: 1234,
    diseases: ["Skin Cancer", "Depression", "Diabetes"],
    region: "Oceania",
    growth: "+7%",
    topMedicine: "Fluorouracil",
    primaryDisease: "Skin Cancer",
  },
]

// Convert lat/lng to 3D sphere coordinates
function latLngToArray(lat: number, lng: number, radius = 2): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  return [-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta)]
}

// Get color for a disease
function getDiseaseColor(disease: string): string {
  return diseaseColors[disease as keyof typeof diseaseColors] || diseaseColors.default
}

interface DataPointProps {
  data: (typeof globalHealthData)[0]
  position: [number, number, number]
  onHover: (data: (typeof globalHealthData)[0] | null) => void
  isFiltered: boolean
}

function DataPoint({ data, position, onHover, isFiltered }: DataPointProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      const scale = hovered ? 1.8 : isFiltered ? 0.3 : 1
      meshRef.current.scale.setScalar(scale)
    }
  })

  const intensity = Math.min(data.count / 1000, 3)
  const baseColor = getDiseaseColor(data.primaryDisease)
  const color = isFiltered ? "#666666" : hovered ? "#FFFFFF" : baseColor

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={() => {
        setHovered(true)
        onHover(data)
      }}
      onPointerLeave={() => {
        setHovered(false)
        onHover(null)
      }}
    >
      <sphereGeometry args={[0.03 + intensity * 0.015, 12, 12]} />
      <meshBasicMaterial color={color} transparent opacity={isFiltered ? 0.3 : 0.9} />

      {/* Glow effect */}
      <mesh scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[0.03 + intensity * 0.015, 8, 8]} />
        <meshBasicMaterial color={baseColor} transparent opacity={isFiltered ? 0.1 : 0.3} />
      </mesh>

      {/* Pulse ring effect */}
      <mesh scale={[3.5, 3.5, 3.5]}>
        <ringGeometry args={[0.02, 0.04, 16]} />
        <meshBasicMaterial color={baseColor} transparent opacity={isFiltered ? 0.05 : 0.15} />
      </mesh>
    </mesh>
  )
}

function Globe({ selectedDiseases, selectedRegion }: { selectedDiseases: string[]; selectedRegion: string }) {
  const globeRef = useRef<THREE.Mesh>(null)
  const [hoveredData, setHoveredData] = useState<(typeof globalHealthData)[0] | null>(null)

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002
    }
  })

  const filteredData = useMemo(() => {
    return globalHealthData.filter((point) => {
      const matchesDisease =
        selectedDiseases.length === 0 ||
        selectedDiseases.some((disease) => point.diseases.some((d) => d.toLowerCase().includes(disease.toLowerCase())))
      const matchesRegion =
        selectedRegion === "all" || point.region.toLowerCase().includes(selectedRegion.toLowerCase())

      return matchesDisease && matchesRegion
    })
  }, [selectedDiseases, selectedRegion])

  return (
    <>
      {/* Main Globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color="#0F172A" transparent opacity={0.9} wireframe={false} />
      </mesh>

      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshBasicMaterial color="#1E293B" transparent opacity={0.2} wireframe={true} />
      </mesh>

      {/* Data Points */}
      {globalHealthData.map((point) => {
        const position = latLngToArray(point.lat, point.lng)
        const isFiltered = !filteredData.includes(point)

        return (
          <DataPoint key={point.id} data={point} position={position} onHover={setHoveredData} isFiltered={isFiltered} />
        )
      })}

      {/* Hover Tooltip */}
      {hoveredData && (
        <Html position={latLngToArray(hoveredData.lat, hoveredData.lng, 2.8)}>
          <Card className="bg-gray-800 border-gray-600 text-white p-0 max-w-xs pointer-events-none shadow-2xl">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-400 mb-2">{hoveredData.name}</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  <span className="font-medium">{hoveredData.count.toLocaleString()}</span> verified prescriptions
                </p>
                <p className="text-gray-300">
                  Growth: <span className="text-green-400 font-medium">{hoveredData.growth}</span>
                </p>
                <p className="text-gray-400 text-xs">Top prescribed: {hoveredData.topMedicine}</p>

                <div className="pt-2">
                  <p className="text-xs text-gray-400 mb-2">Primary condition:</p>
                  <Badge
                    className="text-xs mb-2"
                    style={{
                      backgroundColor: getDiseaseColor(hoveredData.primaryDisease) + "20",
                      color: getDiseaseColor(hoveredData.primaryDisease),
                      borderColor: getDiseaseColor(hoveredData.primaryDisease) + "40",
                    }}
                  >
                    {hoveredData.primaryDisease}
                  </Badge>

                  <p className="text-xs text-gray-400 mb-1">All conditions:</p>
                  <div className="flex flex-wrap gap-1">
                    {hoveredData.diseases.map((disease) => (
                      <Badge
                        key={disease}
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: getDiseaseColor(disease) + "60",
                          color: getDiseaseColor(disease),
                        }}
                      >
                        {disease}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Html>
      )}
    </>
  )
}

interface InteractiveGlobeProps {
  selectedDiseases: string[]
  selectedRegion: string
}

export function InteractiveGlobe({ selectedDiseases, selectedRegion }: InteractiveGlobeProps) {
  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
        <Globe selectedDiseases={selectedDiseases} selectedRegion={selectedRegion} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
}
