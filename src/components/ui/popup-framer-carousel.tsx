'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, animate } from 'motion/react'
import Image from 'next/image'
import TempImage1 from '@public/banner_t1.gif'
import TempImage2 from '@public/banner_t2.jpg'
import TempImage3 from '@public/banner_t3.webp'
import TempImage from '@public/banner_t2.jpg'
import { ContentRenderer } from './content-renderer'

export const items = [
  {
    id: 1,
    url: TempImage1.src,
    title: 'Misty Mountain Majesty',
  },
  {
    id: 2,
    url: TempImage2.src,
    title: 'Winter Wonderland',
  },
  {
    id: 3,
    url: TempImage3.src,
    title: 'Autumn Mountain Retreat',
  },
]

// {
//   "id": 1,
//   "popupItems": [
//       {
//           "id": "691f13b5971c6c4fdfdc8645",
//           "isOnlyImage": false,
//           "image": null,
//           "content": {
//               "root": {
//                   "type": "root",
//                   "format": "",
//                   "indent": 0,
//                   "version": 1,
//                   "children": [
//                       {
//                           "tag": "h1",
//                           "type": "heading",
//                           "format": "",
//                           "indent": 0,
//                           "version": 1,
//                           "children": [
//                               {
//                                   "mode": "normal",
//                                   "text": "안내사항",
//                                   "type": "text",
//                                   "style": "",
//                                   "detail": 0,
//                                   "format": 0,
//                                   "version": 1
//                               }
//                           ],
//                           "direction": "ltr"
//                       },
//                       {
//                           "type": "paragraph",
//                           "format": "",
//                           "indent": 0,
//                           "version": 1,
//                           "children": [],
//                           "direction": null,
//                           "textStyle": "",
//                           "textFormat": 0
//                       },
//                       {
//                           "type": "paragraph",
//                           "format": "",
//                           "indent": 0,
//                           "version": 1,
//                           "children": [
//                               {
//                                   "mode": "normal",
//                                   "text": "금일부로 뭐가 종료되었습니다",
//                                   "type": "text",
//                                   "style": "",
//                                   "detail": 0,
//                                   "format": 0,
//                                   "version": 1
//                               }
//                           ],
//                           "direction": "ltr",
//                           "textStyle": "",
//                           "textFormat": 0
//                       },
//                       {
//                           "type": "paragraph",
//                           "format": "",
//                           "indent": 0,
//                           "version": 1,
//                           "children": [
//                               {
//                                   "mode": "normal",
//                                   "text": "택배는 10시부터 22시",
//                                   "type": "text",
//                                   "style": "",
//                                   "detail": 0,
//                                   "format": 0,
//                                   "version": 1
//                               }
//                           ],
//                           "direction": "ltr",
//                           "textStyle": "",
//                           "textFormat": 0
//                       },
//                       {
//                           "type": "paragraph",
//                           "format": "",
//                           "indent": 0,
//                           "version": 1,
//                           "children": [
//                               {
//                                   "mode": "normal",
//                                   "text": "그리고 11시부터 23시까지는 입니다",
//                                   "type": "text",
//                                   "style": "",
//                                   "detail": 0,
//                                   "format": 0,
//                                   "version": 1
//                               }
//                           ],
//                           "direction": "ltr",
//                           "textStyle": "",
//                           "textFormat": 0
//                       },
//                       {
//                           "type": "paragraph",
//                           "format": "",
//                           "indent": 0,
//                           "version": 1,
//                           "children": [],
//                           "direction": null,
//                           "textStyle": "",
//                           "textFormat": 0
//                       },
//                       {
//                           "type": "paragraph",
//                           "format": "",
//                           "indent": 0,
//                           "version": 1,
//                           "children": [
//                               {
//                                   "mode": "normal",
//                                   "text": "즈추어로 떠일이란 후안이어서 티스어 막크석을, 아알아 으므멘갆다 다쉬초므다 드근엔음 뮈눙등루이볼자다. 킵잔이 겔말여아 억파션이나 으가귀 즈껜해이른던 소훶즌애에 있망캉연의",
//                                   "type": "text",
//                                   "style": "",
//                                   "detail": 0,
//                                   "format": 0,
//                                   "version": 1
//                               }
//                           ],
//                           "direction": "ltr",
//                           "textStyle": "",
//                           "textFormat": 0
//                       },
//                       {
//                           "type": "paragraph",
//                           "format": "",
//                           "indent": 0,
//                           "version": 1,
//                           "children": [
//                               {
//                                   "mode": "normal",
//                                   "text": "드산온좐 하저를, 미둔이 라겨쑤난, 인지아올 자나링초를 햐컁스돌",
//                                   "type": "text",
//                                   "style": "",
//                                   "detail": 0,
//                                   "format": 0,
//                                   "version": 1
//                               }
//                           ],
//                           "direction": "ltr",
//                           "textStyle": "",
//                           "textFormat": 0
//                       }
//                   ],
//                   "direction": "ltr"
//               }
//           }
//       },
//       {
//           "id": "691f13fa971c6c4fdfdc8647",
//           "isOnlyImage": true,
//           "image": {
//               "id": 1,
//               "alt": null,
//               "updatedAt": "2025-11-20T13:13:41.638Z",
//               "createdAt": "2025-11-20T13:13:41.170Z",
//               "url": "/api/image/file/banner_t3%20(1).webp",
//               "thumbnailURL": null,
//               "filename": "banner_t3 (1).webp",
//               "mimeType": "image/webp",
//               "filesize": 66704,
//               "width": 2080,
//               "height": 880,
//               "focalX": 50,
//               "focalY": 50
//           },
//           "content": null
//       },
//       {
//           "id": "691f1407971c6c4fdfdc8649",
//           "isOnlyImage": true,
//           "image": {
//               "id": 2,
//               "alt": null,
//               "updatedAt": "2025-11-20T13:13:59.383Z",
//               "createdAt": "2025-11-20T13:13:59.381Z",
//               "url": "/api/image/file/KakaoTalk_20251120_114633161.webp",
//               "thumbnailURL": null,
//               "filename": "KakaoTalk_20251120_114633161.webp",
//               "mimeType": "image/webp",
//               "filesize": 11634,
//               "width": 1024,
//               "height": 1024,
//               "focalX": 50,
//               "focalY": 50
//           },
//           "content": null
//       }
//   ],
//   "updatedAt": "2025-11-20T13:14:04.168Z",
//   "createdAt": "2025-11-20T13:13:28.934Z",
//   "globalType": "popup"
// }

export function PopupFramerCarousel({ popup }: { popup: any }) {
  const [index, setIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)

  const { popupItems } = popup

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1
      const targetX = -index * containerWidth

      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      })
    }
  }, [index, x])

  if (!popupItems || popupItems.length === 0) return null

  return (
    <div className="flex flex-col gap-3 w-full h-full">
      <div className="relative overflow-hidden w-full h-full" ref={containerRef}>
        <motion.div className="flex w-full h-full" style={{ x }}>
          {popupItems.map((item: any, i: number) => (
            <div className="shrink-0 w-full h-full" key={i}>
              {item.isOnlyImage ? (
                <ImageContent src={item.image?.url} />
              ) : (
                <RichTextContent content={item.content} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Prev Buttons */}
        <motion.button
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform z-10 cursor-pointer
              ${
                index === 0
                  ? 'opacity-40 cursor-not-allowed'
                  : 'bg-white hover:scale-110 hover:opacity-100 opacity-70'
              }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        {/* Next Button */}
        <motion.button
          disabled={index === popupItems.length - 1}
          onClick={() => setIndex((i) => Math.min(popupItems.length - 1, i + 1))}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform z-10 cursor-pointer
              ${
                index === popupItems.length - 1
                  ? 'opacity-40 cursor-not-allowed'
                  : 'bg-white hover:scale-110 hover:opacity-100 opacity-70'
              }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/20 rounded-xl border border-white/30">
          {popupItems.map((item: any, i: number) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-black' : 'w-2 bg-black/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function RichTextContent({ content }: { content: any }) {
  return (
    <div className="w-full h-full flex items-center justify-center py-8 px-12">
      <ContentRenderer content={content} />
    </div>
  )
}

function ImageContent({ src }: { src: string }) {
  return (
    <div className="w-full h-full">
      <Image
        src={src}
        alt="팝업 이미지"
        width={400}
        height={520}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
