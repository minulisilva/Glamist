import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  VStack,
  Link,
  Icon,
  Image,
} from '@chakra-ui/react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa';
import { useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext'; // Import useTheme from ThemeContext

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);

// Animation Variants
const heartVariants = {
  animate: {
    scale: [1, 1.5, 1],
    opacity: [1, 1, 0],
    y: [0, -100, -200],
    transition: { duration: 2, repeat: Infinity, repeatDelay: 0.5 },
  },
};

const fireworkVariants = {
  animate: {
    scale: [0, 2, 0],
    opacity: [0, 1, 0],
    borderRadius: ['50%', '50%', '0%'],
    transition: { duration: 1.5, repeat: Infinity, repeatDelay: Math.random() * 3 },
  },
};

const pumpkinVariants = {
  animate: {
    y: [0, -40, 0],
    rotate: [-10, 10, -10],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: Math.random() * 2 },
  },
};

const snowflakeVariants = {
  animate: {
    y: [0, 200],
    opacity: [1, 0],
    transition: { duration: 4, repeat: Infinity, repeatDelay: 0.5 },
  },
};

const Hair = () => {
  const { colorMode } = useColorMode();
  const { themeKey, currentTheme, currentBackgroundImages } = useTheme(); // Use theme from context
  const currentBackgroundImage = currentBackgroundImages[0]; // Use the first image from the array

  // Array of hair care services
  const hairServices = [
    {
      title: 'Haircut & Styling',
      description: 'Precision haircuts and stunning styling to suit your personality and occasion.',
      image: 'https://i.pinimg.com/474x/ce/b8/a5/ceb8a52a93711492071706675ae31b12.jpg',
    },
    {
      title: 'Hair Coloring',
      description: 'Vibrant, long-lasting colors using premium products for a bold new look.',
      image: 'https://i.pinimg.com/736x/56/7f/f3/567ff3fdc801a0323f57b36fd7e878b3.jpg',
    },
    {
      title: 'Hair Treatments',
      description: 'Deep conditioning and repair treatments to restore shine and strength.',
      image: 'https://i.pinimg.com/236x/15/e0/de/15e0de185c0eb7e0d480678841829e83.jpg',
    },
    {
      title: 'Special Occasion Styling',
      description: 'Elegant updos and styles for weddings, parties, and events.',
      image: 'https://i.pinimg.com/736x/2c/f7/bd/2cf7bdd00f9502657f0e1353fa8386e1.jpg',
    },
  ];

  // Array of trending hair styles
  const trendingStyles = [
    {
      title: 'Curtain Bangs',
      description: 'Soft, face-framing bangs for a chic, effortless vibe.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuz72_kHh6uXD_7k68GymDWvHFl_UyX6SpSw&s',
    },
    {
      title: 'Balayage Bliss',
      description: 'Seamless, sun-kissed highlights for a natural glow.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS63LNBk4OQjxEU6aWMjSkYeUDqwNhnHl0qLw&s',
    },
    {
      title: 'Pixie Cut',
      description: 'Bold and modern short cuts with endless styling options.',
      image: 'https://www.realsimple.com/thmb/JX3oX-3rTCceLnaK49U_7Dj_QO4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/best-pixie-cuts-2-2000-464e8228e7ca43a3bb9f7be92e5dd5a4.jpg',
    },
  ];

  // Array of stylists with Instagram links and usernames
  const stylists = [
    {
      name: 'Ava Rose',
      specialty: 'Creative Coloring',
      image: 'data:image/jpeg;base64,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',
      instagram: 'https://www.instagram.com/avarosehair',
      username: '@avarosehair',
    },
    {
      name: 'Liam Blake',
      specialty: 'Precision Cuts',
      image: 'data:image/jpeg;base64,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',
      instagram: 'https://www.instagram.com/liamblakehair',
      username: '@liamblakehair',
    },
    {
      name: 'Sophia Grace',
      specialty: 'Special Occasion Styling',
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSEhIVFRUXFxUXFRUVFxUQFRAVFxUXFxYVFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGy0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAAIDBQYHAQj/xAA7EAACAQIEBAQDBgYBBAMAAAABAgADEQQSITEFBkFREyJhcTKBkQdCUqGx0RQjYsHw8eEVcpLiFzOC/8QAGgEAAgMBAQAAAAAAAAAAAAAAAgMAAQQFBv/EACcRAAICAQMDBQEAAwAAAAAAAAABAhEDBBIhMUFRBRMiMmEzFCSB/9oADAMBAAIRAxEAPwDjOGqFWDDpLUcxVwwIc2HSU4E9MAhqk53rgWjF5sqMDmmYnqmRkLDFYkPc23g2EpC+shYxJUIlUXZZogkVY2EjSvG1jfaRdSyHxraSB/ePcSMiMBFntErzwR2HpZmsNup/CO8hCx4PiMlRWF9DebbH8/1QAtJaaEbs96hPoFFgPqZj0o2UAfQbka6k9ybfUyPG0Rstjqf8v12/OSiWWeM5xxlU2arproqooN/l/eA/9VrL5c5HXoPkYJQotmAG5Hz+vyMjKFmsPU69gJKIXFDjZI8wBsdxpeX3DOLUqvkJysdg3X5zDp1Fvf09Y4K2ht0uPrvKpF8nRDgrwWpRIkn2b441qhoVLkZcyE6kWIBW/bUTc4/ganpB3U6LqznhPcS14ZXUdYfjOAHpKJsA6ttLbsqi3r1c20qcVRsYvGZD+8jfFX3kiqZJDErsrAAzUYVzluZlQQXE1tBl8MaiDkLiMwwBbWWrU9NJQYmqF1Bj8FxkDQmDtdWXZcZLEe86JwgfyxOaNxilobiX9DnegiasB843CheQ2tcXEiw9cbEznmK+0dDcUwWPp+8yuN58xBfyplHqY60LSZ3FsQvUiQVOIUxuwnFE4/j6wupt2ABMgGH4jV3NT9JLJR2duO0R98fWKcdHKWMOpz/+TRSc+CUvJzQzy09vFeZxp7aeAT0TwGQh409Cx1o4SEEojr6GJZ6JSLBGJnslrCxkJN4woRl1wukoAUi5sWbp08o/ztKYCX+Hp6XIvfXttt+evykIPxKDKRr0ub2GtpC+H1J107+thr2te/yjX7sfQDtc9Pp+ckqAixPz7f5rIWOwlI5gQAbC12+FRoLt+csuGcqPWqoA1yzAuQLZFcnLp08qk/MSu4ajVa6KfgBDEDQH9/adp5epqgHlAJOYnqTbS/ysJnzZdnCNOnwb+WBpyDgwoTwtBvqfOe7d/baEUuTMJrekDdQuuoVRsAOk2WUFPWAvoZkbkn1N8VFqqOfYPlM4PFfxFNrqCVNO2nhsADr+IGx+VpqKmLVtjDMcdJy/iHEqlKu6qfKG0HYHW35zTilvMWoxqHKOgsLiAtglJvaZnCczkfFL7B8VDi8a0Zk7K/inCwTtA6vLpIuJfYiupIh+GqC0qyUc2x3CqlPW20qW4pVvlBnWeIYZXU6TIHgK5ybQr8kozr1KpHWNo4aoxA1nQeH8HRhYyU8ERHBAk3lUY2jy/VLKDfX3mvw/2cioAWJlzRpjOgAnQcLRAURmFpp2Ky2uhgeG/Z3RTcX95cUuTMMDfw1+k1DADrB6mJQbtH8CbkB4bgVFNlH0haYCmNlEEq8YpL94QDEc10V+8PrIRWy/8BOwimQbnqh+MT2VuXkLbLwcGfhFM7fkZA/BOxP6zRJwdCLhvzgGMoGnsT9YjZ+mgoqvDGHWCthHHSXwrnvHqwOhEraycGcWK0K4vh8jXHWe8Kw2dtdhBvglcgwE8JmhxFejT8p39oLVegyFgBf6GRW30LaJ+GcnYvFUxVo0iy9xaQYjlTEUzldCp9QRHcL5qxuGGWhiHRd8oylfoRNhwb7Ui9qfEKK1EOhqILMvqV/aMcH2ZFKPdGY4byqxN2gDVC1gfKR8vhJuPrOyVeE0mpDEYVxUpEX0Nys5nV5Vq4irWZKlKlSptbxKzlFLN5gi2UkmzD2uIlSab3j5Y1JLZyUNSsA34iL/AO4lxBqWQasSALfeOmn5yPiOBqUahVspdTZrHMraXDKfvAi0vvs74cKtdehUq9/Yg2+YuIcpJRsVCDctpsuT+V1QB6inNobHp6kTT4zi1KgQpuW6IozMfkNpa06FhKvHYilhg1TKqncsdyffcznbt7tnWUdqqITW5vKU/Nhag6XNwR62y7fOR4HmanV0ylT62P6TJVuanxLMMOK1VlXM+WmqKgvbXOwMtuVMIK4ztTKkHU2ykEHYiMmvKAx12dlzxXHKiFmNgBOQcc4mtSuzoCFNt/TS82v2iFxWpYUK2RwWZgQi6bKXNwo0P5TmOIe7EWKgaANYkD3G/vG4Y0rMurnfBZU8YJt+DYmnk3E5g5kiYxxsxEe22YlwdRrOt9GlVi+PGm1r6TFUeLVb/FeR4muzm5MpNdwmzomE5rVvLfWFLiwdZzThjZXuTOi8IemFDG0GcklYcIuTG4ni1VPhFhK2pzLX7y7xVdKgtpM/isOl9NTEKbNHtoKwvNdUMCV2mnP2iVQoCp9TMVS4eQbnSS42nYAiNhka4QE8Kqy+xPPWKbaw+plViOYsS+9U/LSVBMaYW5+RW1BVXG1G3dj8zIC/rIzPJCyTPFIopCFBgsY40DG0tqOHqVhoR+8z1DynXaX/AAjjy0XBI8v1jVLkHb8RlXA1EBJG0ioN5h7zccbdHwviqALrMHhD5l94xiwfmBtRJeXdm94NzL8S/OecIxWRDpqTFKNrgu6Z7j1uxJ7mDsw6R1ZyTcyAmPqgSW8aCI0meCWQ2X2fc2HBVcrG9Cpo6nUKT94f3m+5d4lhzia1Cmyscy1qWxurFVqKD6WB9iJw9qloVwHij0cRTqruhzW2zAfEt/UXHzic0FONDsGV45Wdq5j4BSxLlHRaYcqUZcoZDrc29e3+5nOUsCcHjWpVlIsWAcAlWHRhbYafn6GbTC8foV6KGlRqYgPZcyCkGUnzeH52UlwBcquot0JF/Er06x8SlUD3AubEEEgGzKdVb0nObnCNNcM6NQnK0+UaOkqkXBvfYyc4QMp0B/aUlHGZdDLXA48A33HWLi1fIyUZVaKbFcu03Otrf9o/1LnAYFadPKm08xeIUEkfSRNiGVdVc36KLn2/3CvktptAnMXDUrILg3XrsZxbnfhIoYjyA5HUMNzYjQi/yB+c63xDm2lSBSqhpt90M1N2bv5UYzI8TqriLVAPLYWv0uAbfmI/FdmbUpbOTlxMbNbjOH02uLC8oqfDCzlRtNHTqc6gBN5I0vk5ZPRj+sHxPA3XY3+UplUVVNrES1PEjoFMrXw7A2trL7g3AGcZ20gSruPw30RZ4DM1MX6w3CYEKwN7xwGUAaaT2niwCbxRtXIzjNF3FkNpVYig9FFFQ3vJcVjmzXG0qeN8baquQjbrDjYvM4pBHjjvGNXHeZ7+IYdYPiMU3eNUTHvNKcUveMOMXvMt/EsesQqkm195e0m40/8AF9hFBlsBaeRuxAbmA02zWvLDC4MVWCd4AaedgEM1PLXC/DcPUbvpFRjbNDlSJ+OOaVAUrnbrtMtgT5195oecmvaxuLD5TM4NvOI9mYbzCL1FHvGqlh7STHa1L9hG20l4lxZUgR4wmS1RrIXhMo8MTNaegSOqYJYwyfAp5j7frIJ6CRqIJZ0jlTidfD0gKVKnUBcPlqA2FS2UNuLbLp1sJreB4c0AgZlZmBZ2XRWZnZ2I9mZhBMFwbwaNO4v5EDE9wBoex7GWFPCllshGa90J8oJ6qfwt+uk5uWdujrYcSirLqsgOsHs67HSU1PmBUbw6wNNxpZtPp3lvQxquuhBmejSiarjAgzvc26AFj8lGpgOI+0HDKPKtZz6U2QfMtaWFKmb3gHF+Cq4LKCjb3XTX1jYNdyR238jJcY57DK4/hQQerZiB7+USr5a42tUiifLfa0rOdcFUoKA73DtYDY6am+sy+CxJSojA2IYa/Ob8CSVnP9QnB5NsOiOnca4O1Hz3uJnsA16hmn5h4pmoLfqB9ZleF1AHBPf+8bLlow9DW8LcUlLVTYespuL8fUsRTW+vbSC8xcYFXLTGw39YHRTylgIddjDn1Li/iSIxJz5ReWK8ac08oGXpKzC1Piv22kZq6Wg7I+DI9Vm5SYc+KNtzeReOe8D8UDcyJ+IKITSYuDyL6tljVYlcsBbhZte8r63HPwxUuYGG4Bi3CPY6EMuo2/JWKthGvYQPE4VhvLvhFQ1De25hvMOGypcgfKUomuLtWzHBJ7hh/MX3ngqXMMwdHzAyIMtQIozPFGAguDoMr3ItebvAqHRSW2v+UpgARtCqHE6dNQhIB1/OKxStsflhtSI+b28g1BFhqNNe0yWGbzCaLmbiNNqYVbXsNpmcOdY2QgIq7xpM8z3MTGHD6oF9SKpB32k1UyFpGQcu14O8kVtLRU6LOwVFLMdAALkmA2WhlNCSAASToABck9gBvOg8ofZzXepTq4keGgYN4fxO4XWxH3RoJt/s95BTDIKtRQ1cgZmOuT+lP36zaJYubD4dL++9vpM08jfCNcMKXMuoJQwGYFWGnUHX2lRiMEaDXGq9Qdv8/Sa7CWEbxHChh0mScNytGyE9r2swvHMNRrLlqKHUjr8SH3/uJzniaYjAvnoVS1P8LebL/wAe06Vxnh7pqgJHUbm3pMDx97kDre1uvtAxv5V2HZPrfcL4N9pqrYYhCv8AUvmH03l3iftKwYXRyfQKf2nG+KKBVZRsun7/AJ3gc2LTwfJznq5rg0POPMZxlUMBZFuFB3N9yfoJQhoyeiaIpJUjNKTk7ZuaOINTDDMfhFxKVcXlB7mP4KxNEjprKzUmV1ZU/rwE4XfMxlxR4wAMqiVRoEqCIOmIyE6XMZ0OZPGsv6W9bGXudr9oBW4hbaC1KzNoBDuH8Dd9W0EGU0uo7BpN3YrHxDMdT8pBWDdZsF4TTQbXPeZ3iS+cxccm58G6eD2o2V6rCFodTGCn2kheMENtvgv+F1PDKmWnM2NzUfW0zfDMQM4DHSH8wYpSAFPSRJ02aHVUjPUE1llglOY+36/4ZX0W84vtcXl1iagX4e0iXcEccSBpFAcpil2UaNGsJnsdTu5JlzUeyzMY7EFmtM2K7NedqiY0x3iDhReBj3MRQGOMgRhatyYQ5gWH0MMeOg+AWRVJFVW2xvpr6ekkaOxwXO2Q5lGxAK5hbex1EqRaJ+X+DVcXWFKkN/iboi9zO3cq8pUMNlCgFxYs53JHrK3kbgq4XCodDUq+Zj6W0HtNfw1tLzJPLbN2PFtV92WdTiSr/LXVhluNba+sjDAC53NyZTPVV6uZLWZVOb8fmtp9Jc4RRpnNwBYDuesrhxLV7htLE6iwJv26f8wk4sndGHoRJMMVYEL09hrtpE2Bp5r3NxrcE/rCeOMV1BWSUnyC1mvsh9yQP7wTFcGo1dXpIx7kAkex3l22XosWWY5KzSp0c+4j9mvDqhJ8EqTuUd119iSPymM459k2W5w1Ykj7tW2v/wC1At9J3CpQvtAMThe8pZMkH1L9vFPqj5Y4nwyth38OtTZG7HY+qkaMPUQUT6M5v5epYmgyOAeqn7yN0KmfPGKw5pu1Nt1YqfcG034su9fpgz4fbf4XHAKnkYQOgpDkHuZNy/WClryeqQXJHeGvsZ80qxllgU0MB4lgQNbSzwI8slxCgixjThrK4ztGf4dQvUA7zbYehZZnOGYUeOCJs/C0mPP9qPTen08e4oOJPYGZHEC51m74th1WmWO9phWosddhCwLqBr5U0gSvUA0Emwa3WA1BqZLSrkaR7EQSR69wb+slBJFzBqlQmTLU0lMsYL5gB1lqF2Er8ELvfsD+0uqaZRc7y0QctIRRwqntFCIe4ip5TMvVbU+80WLPlMzZ3iMaH5nyhwaOVpHEIxoQSK2ssQbiDcOwT1mIX7qs7HUgKouTpLmnh6lIJSAdWxCi4ASozUXawyqPMGNibaXAEOLpFURVuEVVViylWVQ7IQVZaZ2dr6AH6ytquCSbW0Gg20AEvMVinRql6Pi06Rakr1kytTc6ZquX4qluhJ6SprYNkVC2Q+IudcrKxte3mA+E+hlN2WdU5Nx5fC0QWuQpHtY2tNpgm8gE499nWNIqtTJ0ALAdu9vynWaVSyi3b85zsy2to6eGW6KYTTUZ1yjKFQZRa1szdvYH6whcSFUtuLE2gtKp5iT/AJp/uR4TVLHYj9YM5UkgoR5bBcNxSso2Kq12U6a/L5zQ8HrZlvlIueu3fSVOEwoyBH83vrp0GsusKQBYaD6QZZLLjjosVjxBkqz0VYKkU4MPoLI8bTB2kVOtPK76Ru5bRai1Kyg4qLAz5554o5cZU/qs31Fv7T6H4oLzhf2nYfLiEb8Skf8Aif8A2laV1koZq1eKzJ4U6yywxlXROsucFSvadNHC1DqJcUmyqJBWrEyOrV6SIAkwjmRh3Yfwhf5gM2VA6TJcMHnE1uG2mPP9j0Xpn8f+lZzG1qRmQY+W003NtSyAd5lC2kZgXxMnqLvKl4KXEjzGRw7+DZ20ixXDGSNGQi2kAT3WE08KYUuHgOaRqx6Sc/wZwoWux9h+p/tDw+YwIGxtDML3hpmea2yaDRaKBPVN4pYJJWN0MzxGpl/QTT0lLiVysYqA7L2ZDLTh3D1FVRiCaa2LMuVy5AFwoAFwSOvaS/8ASvBUPXp1MpZAStgACgcqM275T2sJPTxXheJl1eugCFaxJoq51FQjdiLCxPXWMEkv8MzIFpUEz1M1T+VULvSorurUwSEXW921NoPRVC5qgVaFAGyuuasyuF8qh/L5ja/pIVGQth2FNXZlU1S+lNeq3U2ym4uddorpnWkfMiMQTSZgcQxNgy57gE6dBpeUQVWkrD+XUJAQPV8QikPE6qgJ85/Mzyth/Ij0l3BFSzF8rC/xXFkJAJC3MbhSitUWpdCQyrcBhTOxzXF9BpcaxU1YUluW8Jna4VrZmVR906XAI19ZCBfKWIy4pDfcMv1BP9p2jAvmpg+k4dwcZa1NgPhdb+gJt/edm4e9qJ9AZl1C5TNulfxaLGnXJUn0k/D38srsO3kHtC8E+kzTNcSyJj6Ne0GDRDSKaGIs0ryZakp/HtCaGIBghFolSPd9IHTaSM+kNMBx5AMeZyD7VqWlNv6iPqD+063jWnL/ALRqXiKqj8Y9Ohh6f+iB1H8mcxpby4wz2EGGEUBiWykbDe56g9v+Y4NbSdZHns6sNRrwoPK1akIpvLMU4Flga4Di81uEbqJhGM1PAsZdQDM2ePNnY9MmvbcCPm6ndAe0yFU6TccwDMkwuI2MLA+KFa7HWRS8kuAq2F4XWr5txK/Anywm8GTdnptLjg8MXXY8yxFYiYw1IA6eSEFyDlPMf86SYNYSMtGsZpXQ8xkkpTbXdsfFPAYpYBPgm0jBhl/nVGXMEQWu4QK7mym27nRjlHbXSQ4CtG4xFFQFsxBvoLXuBoAfe3SKjwx83cRYevkqUyuWpYg5aovTLncFSdRe2pttPMRWdapqFaZJZmFlBovqb5VsAVv+k8wypUc0yq0ywVQzuVWkVHmZu5Nj8zG0qt0ak7MLaooW5epcAITuBYtp3PrGCAqrRYhqNOoCoXxamZRQ81tRrq1rgAdztFjazGp4lVCrqqBVyKUdlt8QAAC2tca7wLwbaP5dTfQ50YA6MN7SF2O1zYbC97X3tLSIPr4lnZmbdjcgAAX9B0klfEAFQGZlAvlIyhGPxAC56gajeDREQqIWGDxj0mJVihKsjAEKWRxZl1B0I9D0m24HzCaeHpeM6FKni0wQSalJqeWzVrnZs1hp92/XTnNPUgG5J0Ft77D39pYHBvmKeFUzqLlcrZlUDNmZbXAsQbnoYucFLhhwm4u0dnwtS6i3aG0BMLynxtci0WqqzBUKnUXVlDZdd2Qkqf8AtvN7hmBUGc7JFxdM6eOakrQYgnrmeownjkRTGgtc6ESp4Vi6lOsaVQ3U6027gbg+o0ltWtM/xc2ZH/C6/Q+U/r+UpdQr4Nzh3hDGVeAq6CHM+kohn+ZMY6EBWVQRudwfQdek5vzeG8MuxYm4tcZeutgZtub+a8NhrhiHq20QWJF/xH7onM+YOOGuijOr5rMbI1I0WH3DcnMP6h2mzBCXDox6iceU2ULm8ezd/wDcaD0223Gs9rWB0N/WbjmTSo8DQzDwJRDKEtGTIuAsQ3guJsxWAKdIGuJyVA0GatBaOezJZusQ2ZJiuKixImowuIDLeZzmCnY3iMbqR1dTDfC/AJgDpCGMF4adDCnMkup19O/9dV4BKteeU3kFfePptGxSODOUpPl2Tlo0GNvPLwwB5MUZmikITVMMwYuNQdTbpJMWb076X6X1+nrI1xmTqeoIG+0Fq4hrB84ucy5FFsi7a+8VFNhqVKhwVWBsr1H87Ob2GWwObuCDe995O/jHxnzLUF0FRhY3LG6sul73XcQBBppprYtfoRa1tz1k1JU2D5WDMc+oVlUXW3UNcfnGABOGd2yWZGYM5UMfMG0LZ7jzBgLDWAlCTtqSfKNwe1t4+lSLXqNdlDDxLG72J1bXv37yVOIOjBqTMAjN4ZOUst++mukshCqWkb7wuvSOVapqKxqFiyg3ZTfUsPWQNCsogYy54PxytQao9Goc9Sm1N2cZiEOTUMetxb5SlIhlFf8A6yxNr9LaKpJItbfe3vKZYqTWsdVIO/6W9ZfvzD42HrLXr1VdQgw9OmMiO1/M9VhvYdD30mW1/wCbd9v0izQWky1JrodT5O5yp+AtPEVLOvlDNc516EnoRsSe3rKXm/mt6lcU6NfJTBQCqjMLXtc+U6i5N732EwzfL31hlHCNlYtSYCmyGq18pRGNguU9SYtYYqW4a88nHaX+M4/xGn8VdiuYoKi5KlN2A1Cvls0evMWIq0ajPUpgo1IBbEPVLFibW0AAQkn1A6yjGOdEVUdlDUmVhcOpVyQ+UXOUkAA7H6wZm0AAstzba/TcjfaF7cfAKyzXdnRP/kNkFko39Wa35Af3kuP+0Gs+FZkp+E97eIWUg9/DVtWbXsQJzRq9tBvIRfc6+8H2MfgL/IyeS1Th9StSrYpqlPLTPmzuQ7ltsq2OYm+5t1juM8Rw7rQFCj4RSkqVTcHxqg3fT9d9fSR1OFgOieNSu6Umvfyo1VgPDY7AqGzE7AC28hxnDTTsW8yOagpuh8tbIxTMv9OYD3EYJG4jFs+TMwOVQqmwuqjZWNhe3TeKrXuqIAAFzG/VixFyfkFHygojgZYDbJ6bQqk0BUwmmZYiaDC2krKx1hlZ9IAx1kYOGPcvOC4rKcp+UM4zSDJKVNr9RLzBVhUS3WJnGnZ0dNl3xcGZ3h+hIhVY6SOrRyVCIyu2kF8s6uGe3T0/0ErbxUTGVIqcajihBM8vGEzxmhEH54oMSYpCGgfAt5sxC3Ha5YHS1wZV1sAcrOosqZQ1zrdr20+UUUy45tlhFLD0XfMVZKZAsmbOWPXzW0HygbUs18qgKlgx92IDEd/btFFHRk22UMLZGZVa63sd1FQA31HbSSMabmo1vD600XzC/UEnYbxRQyEIqenp2jrxRQyhriSUXZlFPQ62UWF7uR1ttoOvWKKUy0Pp11Z71AcmgKrYGw2y+3/EP/hVqv4zHJh2qimXVQMjtTzG1IE6XGtum3aKKUQgbF0qp/mrkK0cimmAA9Vb5HqC3UWU27A943G4yuzrVqsS7BGDGxzhPKpYfePl66xRSEPeIozg4vKirUquCiAqKbHzWAPTe1j06QBqnaKKQhJh6KlHZmsVC5Ra+cswFr9NMxv6WhwZaa0avgKVs/xHMK1RTuyj7qll8vW2pN55FKIN4xw9qFU0nKlgEZsosoLoHIA20zW000nuDxzKugzNTdKiFvMtJQWDAAnS7uh06i/SexSEK6tVLMWO5JJ6aneeqYopYLHKYRTM8ilipkmIOkDU6zyKUVj+ofmssO4BUFyOsUUGfQPTfYfxijlN5UVXvFFFI68W9jQKxniT2KORzn1HXjWMUUsoZeKKKQo//9k=',
      instagram: 'https://www.instagram.com/sophiagracestyles',
      username: '@sophiagracestyles',
    },
  ];

  return (
    <Box
      position="relative"
      overflow="hidden"
      bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.900'}
    >
      {/* Holiday Animations */}
      {themeKey === 'valentines' && (
        Array.from({ length: 10 }).map((_, i) => (
          <MotionIcon
            key={i}
            as={FaHeart}
            color="red.500"
            boxSize={6}
            position="absolute"
            top={`${Math.random() * 50}%`}
            left={`${Math.random() * 100}%`}
            variants={heartVariants}
            animate="animate"
            zIndex={1}
          />
        ))
      )}
      {themeKey === 'newYear' && (
        Array.from({ length: 10 }).map((_, i) => (
          <MotionBox
            key={i}
            w="30px"
            h="30px"
            bg="gold.400"
            position="absolute"
            top={`${Math.random() * 80}%`}
            left={`${Math.random() * 100}%`}
            variants={fireworkVariants}
            animate="animate"
            zIndex={10}
            boxShadow="0 0 15px rgba(255, 215, 0, 0.8)"
          />
        ))
      )}
      {themeKey === 'halloween' && (
        Array.from({ length: 6 }).map((_, i) => (
          <MotionBox
            key={i}
            w="50px"
            h="50px"
            bg="orange.500"
            borderRadius="full"
            position="absolute"
            top={`${Math.random() * 70}%`}
            left={`${Math.random() * 100}%`}
            variants={pumpkinVariants}
            animate="animate"
            zIndex={1}
            boxShadow="0 0 10px rgba(255, 165, 0, 0.6)"
          >
            <Box position="absolute" top="15px" left="15px" w="10px" h="10px" bg="black" borderRadius="full" />
            <Box position="absolute" top="15px" right="15px" w="10px" h="10px" bg="black" borderRadius="full" />
            <Box position="absolute" bottom="15px" left="50%" transform="translateX(-50%)" w="20px" h="15px" bg="black" borderRadius="0 0 50% 50%" />
            <Box position="absolute" top="-10px" left="50%" transform="translateX(-50%)" w="10px" h="15px" bg="green.700" borderRadius="50% 50% 0 0" />
          </MotionBox>
        ))
      )}
      {themeKey === 'christmas' && (
        Array.from({ length: 15 }).map((_, i) => (
          <MotionBox
            key={i}
            w="8px"
            h="8px"
            bg="white"
            borderRadius="full"
            position="absolute"
            top={`${Math.random() * 50}%`}
            left={`${Math.random() * 100}%`}
            variants={snowflakeVariants}
            animate="animate"
            zIndex={1}
          />
        ))
      )}

      {/* Main Section */}
      <MotionBox
        as="section"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={{ base: 10, md: 20 }}
        bgImage={`url(${currentBackgroundImage})`}
        bgSize="cover"
        bgPosition="center"
        position="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <Box position="absolute" top={0} left={0} right={0} bottom={0} bgGradient={currentTheme.bgGradient} opacity={0.7} />
        <Container maxW="container.xl" zIndex={2}>
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" gap={{ base: 10, md: 20 }}>
            <VStack align={{ base: 'center', md: 'start' }} spacing={6} flex="1" textAlign={{ base: 'center', md: 'left' }}>
              <Heading
                as="h1"
                size={{ base: '2xl', md: '3xl' }}
                fontFamily="'Playfair Display', serif"
                color="white"
                lineHeight="1.2"
                textShadow="2px 2px 8px rgba(0, 0, 0, 0.3)"
              >
                Luxurious Hair Care with Glamist
              </Heading>
              <Text
                fontFamily="'Montserrat', sans-serif'"
                fontSize={{ base: 'md', md: 'lg' }}
                color="white"
                maxW="md"
                textShadow="1px 1px 4px rgba(0, 0, 0, 0.2)"
              >
                At Glamist, we offer premium hair care services to enhance your natural beauty. From cuts to treatments, we’ve got you covered.
              </Text>
              <Button
                bg={currentTheme.primaryColor}
                color="white"
                size="lg"
                fontFamily="'Montserrat', sans-serif'"
                _hover={{ bg: `${currentTheme.primaryColor.split('.')[0]}.600`, transform: 'scale(1.05)', transition: 'all 0.3s ease' }}
                as="a"
                href="/hair-app"
              >
                Book Your Hair Care Session
              </Button>
            </VStack>
            <MotionBox
              flex="1"
              w={{ base: '100%', md: '50%' }}
              h={{ base: '300px', md: '500px' }}
              bgImage="url('https://images.pexels.com/photos/853427/pexels-photo-853427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"
              bgSize="cover"
              bgPosition="center"
              borderRadius="md"
              boxShadow="lg"
              position="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bg: 'rgba(0, 0, 0, 0.1)',
                borderRadius: 'md',
              }}
            />
          </Flex>
        </Container>
      </MotionBox>

      {/* Hair Care Services Section */}
      <Box as="section" py={{ base: 10, md: 14 }} bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <Container maxW="container.xl">
          <Heading
            as="h2"
            size="lg"
            fontFamily="'Playfair Display', serif"
            color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
            textAlign="center"
            mb={10}
          >
            Our Hair Care Services
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10}>
            {hairServices.map((service, index) => (
              <MotionBox
                key={service.title}
                spacing={4}
                align="center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <VStack>
                  <MotionBox
                    w="200px"
                    h="200px"
                    bgImage={`url('${service.image}')`}
                    bgSize="cover"
                    bgPosition="center"
                    borderRadius="md"
                    boxShadow="md"
                    position="relative"
                    whileHover={{ scale: 1.05, boxShadow: 'lg' }}
                    transition={{ duration: 0.3 }}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bg: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 'md',
                    }}
                  />
                  <Heading
                    as="h3"
                    size="md"
                    fontFamily="'Playfair Display', serif"
                    color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                  >
                    {service.title}
                  </Heading>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    textAlign="center"
                  >
                    {service.description}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Trending Styles Section */}
      <Box as="section" py={{ base: 10, md: 14 }} bg={colorMode === 'light' ? currentTheme.sectionBg : 'gray.700'}>
        <Container maxW="container.xl">
          <Heading
            as="h2"
            size="lg"
            fontFamily="'Playfair Display', serif"
            color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
            textAlign="center"
            mb={10}
          >
            Trending Hair Styles
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {trendingStyles.map((style, index) => (
              <MotionBox
                key={style.title}
                spacing={4}
                align="center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <VStack>
                  <MotionBox
                    w="250px"
                    h="250px"
                    bgImage={`url('${style.image}')`}
                    bgSize="cover"
                    bgPosition="center"
                    borderRadius="md"
                    boxShadow="md"
                    position="relative"
                    whileHover={{ scale: 1.05, boxShadow: 'lg' }}
                    transition={{ duration: 0.3 }}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bg: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 'md',
                    }}
                  />
                  <Heading
                    as="h3"
                    size="md"
                    fontFamily="'Playfair Display', serif"
                    color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                  >
                    {style.title}
                  </Heading>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    textAlign="center"
                  >
                    {style.description}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Our Stylists Section */}
      <Box as="section" py={{ base: 10, md: 14 }} bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <Container maxW="container.xl">
          <Heading
            as="h2"
            size="lg"
            fontFamily="'Playfair Display', serif"
            color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
            textAlign="center"
            mb={10}
          >
            Meet Our Stylists
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            {stylists.map((stylist, index) => (
              <MotionBox
                key={stylist.name}
                spacing={4}
                align="center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <VStack>
                  <MotionBox
                    w="200px"
                    h="200px"
                    borderRadius="full"
                    overflow="hidden"
                    boxShadow="md"
                    position="relative"
                    whileHover={{ scale: 1.05, boxShadow: 'lg' }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={stylist.image}
                      alt={stylist.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                      fallbackSrc="https://via.placeholder.com/200?text=Image+Not+Found"
                    />
                  </MotionBox>
                  <Heading
                    as="h3"
                    size="md"
                    fontFamily="'Playfair Display', serif"
                    color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                  >
                    {stylist.name}
                  </Heading>
                  <Text
                    fontFamily="'Montserrat', sans-serif'"
                    fontSize="sm"
                    color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
                    textAlign="center"
                  >
                    {stylist.specialty}
                  </Text>
                  <Flex align="center" gap={2}>
                    <Link
                      href={stylist.instagram}
                      isExternal
                      color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                      _hover={{ color: colorMode === 'light' ? `${currentTheme.primaryColor.split('.')[0]}.700` : `${currentTheme.secondaryColor.split('.')[0]}.500` }}
                    >
                      <Icon as={FaInstagram} w={6} h={6} />
                    </Link>
                    <Text
                      fontFamily="'Montserrat', sans-serif'"
                      fontSize="sm"
                      color={colorMode === 'light' ? currentTheme.primaryColor : currentTheme.secondaryColor}
                    >
                      {stylist.username}
                    </Text>
                  </Flex>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default Hair;