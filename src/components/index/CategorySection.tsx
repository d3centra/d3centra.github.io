import { SimpleGrid, Text } from "@chakra-ui/react"
import Section from "components/common/Section"

type Props = {
  title: string | JSX.Element
  fallbackText: JSX.Element
}

const CategorySection = ({ title, fallbackText, children }) => (
  <Section title={title}>
    {children ? (
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={{ base: 5, md: 6 }}
        autoFlow="row dense"
      >
        {children}
      </SimpleGrid>
    ) : (
      <Text>{fallbackText}</Text>
    )}
  </Section>
)

export default CategorySection
