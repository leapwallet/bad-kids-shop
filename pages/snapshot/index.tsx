import type { NextPage } from "next"
import { Container } from '@chakra-ui/react';
import SnapshotCard from "../../components/SnapshotCard";
import { Layout } from '../../components/Layout';

// const chain: GrazChain = {
//   ...mainnetChains.sommelier,
//   rpc: "https://sommelier-rpc.polkachu.com/",
//   rest: "https://sommelier-api.polkachu.com/",
// }
//
// configureGraz({
//   defaultChain: chain,
// })

const Snapshot: NextPage = () => {
  return (
    <>
        <Container centerContent paddingY={8}>
          <SnapshotCard />
        </Container>
    </>
  )
}

export default Snapshot
