import { useWeb3React } from "@web3-react/core"
import useSWR from "swr"
import { User } from "types"

const getlinkedAddressesCount = (addresses: string[] | number) => {
  if (!addresses) return
  if (Array.isArray(addresses)) return addresses.length > 1 && addresses.length - 1
  return addresses > 1 && addresses - 1
}

const useUser = () => {
  const { account } = useWeb3React()

  const { isValidating, data } = useSWR<User>(account ? `/user/${account}` : null)

  return {
    isLoading: isValidating,
    ...data,
    linkedAddressesCount: getlinkedAddressesCount(data?.addresses),
  }
}

export default useUser
