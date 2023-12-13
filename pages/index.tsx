
import {
  useColorMode,
} from '@chakra-ui/react';
import Text from '../components/Text';


export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div>
      <Text size="jumbo" color="text-white-100">Buy NFT</Text>
    </div>
  );
}
