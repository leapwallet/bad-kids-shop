import React, { useMemo } from 'react'
import { useNFTImage} from '../hooks/useNFTImage'

type GenericCardProps = {
  nft: {
    image: string, 
    media_type: string, 
    name: string, 
    tokenId: string,
    collection: {
      name: string
      image: string
      media_type: string
    }
  }
}

const Images = {
  Misc: {
    Sell: 'https://assets.leapwallet.io/dashboard/images/misc/sell.svg',
  },
}


export function GenericNFTCard({nft}: GenericCardProps){
  const { imageComponent } = useNFTImage({
    image: nft.image,
    mediaType: nft.media_type,
    nftName: nft.name,
    classNamesProp: {
      img: 'rounded-lg',
      video: 'rounded-lg',
      skeleton: 'rounded-lg',
      textDiv: 'rounded-lg',
    }
  }) 

  const { imageComponent: collectionImageComponent } = useNFTImage({
    image: nft?.collection?.image ?? nft?.image ?? Images.Misc.Sell,
    mediaType: nft?.collection?.image ? nft?.collection?.media_type : nft?.media_type,
    nftName: nft?.collection?.name,
    fallbackImg: Images.Misc.Sell,
    classNamesProp: {
      img: 'rounded-full',
      video: 'rounded-full',
      skeleton: 'rounded-full',
      textDiv: 'rounded-full',
    },
  })

  const nftNameString = useMemo(() => {
    let name = nft?.tokenId ?? nft?.name
    if (!isNaN(name as unknown as number)) {
      return `#${name}`
    }
    return name
  }, [nft?.name, nft?.tokenId])
  const onNFTClick = () => {
  }
  return (
      <button
      className='relative flex w-[calc(50%-6px)] sm:w-[calc(50%-12px)] md:w-[calc(33%-16px)] lg:w-[calc(25%-18px)] group cursor-pointer flex-col items-center justify-start gap-[2px] sm:gap-3 rounded-2xl p-0 sm:!p-4 ease transition-all duration-300 border-[0] sm:border border-gray-100 dark:border-gray-900 hover:shadow-[0_7px_24px_0px_rgba(0,0,0,0.25)]'
      onClick={onNFTClick}
    >
      {imageComponent}
      <div className='absolute top-0 left-0 aspect-square w-full flex-col items-start justify-end p-5 ease transition-all duration-300 hidden group-hover:flex'>
        <div className='flex shrink-0 flex-row items-center justify-end gap-1 rounded-full bg-gray-100 py-2 px-3 backdrop-blur-[10px] dark:bg-[#38383899]'>
          <img src="https://assets.leapwallet.io/stars.png" alt="Stargaze" className='h-3 w-3' />
          <div className='text-[10px] !leading-3 text-gray-800 dark:text-gray-200'>
            Stargaze
          </div>
        </div>
      </div>
      <div className='flex w-full flex-row items-start justify-between gap-2'>
        <div className='flex w-full flex-col items-start justify-start gap-[2px]'>
          <div className='flex w-full flex-row items-center justify-start gap-1'>
            <div className='h-5 w-5'>{collectionImageComponent}</div>
            <div className='w-full overflow-hidden text-ellipsis whitespace-nowrap text-left text-base !leading-6 text-black-100 dark:text-white-100'>
              {nft?.collection?.name}
            </div>
          </div>
          <div className='w-full overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm !leading-5 text-gray-600 dark:text-gray-400'>
            {nftNameString}
          </div>
        </div>
      </div>
    </button>
)
}
