import { useColorMode } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import ConnectWalletAlert from "components/common/ConnectWalletAlert"
import Layout from "components/common/Layout"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Page = (): JSX.Element => {
  // Setting up the dark mode, because this is a "static" page
  const { setColorMode } = useColorMode()
  const router = useRouter()
  const { account } = useWeb3React()

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
      {account ? (
        <>
          {/* <Alert status="error" mb="6" pb="5">
            <AlertIcon />
            <Stack>
              <AlertDescription position="relative" top={1} fontWeight="semibold">
                Invalid server ID or user ID!
              </AlertDescription>
            </Stack>
          </Alert> */}
          <Card p={{ base: 5, md: 7 }} mx="auto" maxW="lg">
            DC auth
          </Card>
        </>
      ) : (
        <ConnectWalletAlert />
      )}
    </Layout>
  )
}

export default Page
