import { useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Page = (): JSX.Element => {
  // Setting up the dark mode, because this is a "static" page
  const { setColorMode } = useColorMode()
  const router = useRouter()

  useEffect(() => {
    setColorMode("dark")
  }, [])

  return (
    <Layout
      title="Discord authentication"
      description=""
      imageUrl="/dc-logo.svg"
      imageBg="DISCORD.500"
    >
      <Card p={{ base: 5, md: 7 }} mx="auto" maxW="lg">
        DC auth
      </Card>
    </Layout>
  )
}

export default Page
