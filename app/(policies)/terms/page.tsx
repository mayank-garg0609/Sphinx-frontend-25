import Link from "next/link";
import policyBG from "@/public/image/policyBG.webp";

export default function TermsPage() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${policyBG.src})`,
      }}
    >
      <div className="p-10 rounded-xl text-white max-w-7xl w-full h-[80%] overflow-hidden-md  flex flex-col">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Terms & Conditions
        </h1>

        <div
          className="overflow-y-auto flex-1 pr-4 rounded-md h-6/12"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#6b7280 #1f2937", // zinc-500 and zinc-900
          }}
        >
          <p className="text-sm leading-relaxed tracking-wide pr-2">
            {/* Your long terms & conditions text */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lectus
            nisi, hendrerit non finibus nec, lobortis at ligula. In hac
            habitasse platea dictumst. Quisque iaculis massa et diam semper
            finibus. Cras nec gravida mi. Vestibulum ac luctus massa. Nullam
            feugiat consequat metus, tincidunt iaculis leo lacinia fringilla.
            Quisque congue lacinia lacus, ac mollis elit dapibus ac. Donec
            finibus malesuada convallis. In mattis nibh turpis, vel commodo
            tellus lacinia sit amet. Pellentesque at massa vel neque viverra
            commodo nec quis ipsum. Duis efficitur hendrerit tellus, eget
            convallis ex tincidunt vitae. Mauris non ex turpis. Integer
            facilisis, magna in aliquet sodales, odio felis auctor orci, quis
            fermentum risus nunc quis erat. Fusce semper quis tortor sed
            lobortis. Praesent nec lectus id est fermentum lobortis at sit amet
            massa. Suspendisse sit amet luctus metus. Aenean gravida purus quam,
            eget sagittis nulla dignissim at. Nullam venenatis tincidunt sem,
            quis venenatis libero cursus faucibus. Nunc sit amet ultrices lorem.
            Nulla facilisi. Maecenas sed dictum lectus. Proin nisl nisi,
            imperdiet sed molestie rhoncus, interdum nec erat. Proin in
            vulputate sem, id pulvinar nunc. Nulla facilisi. Etiam ac nunc
            magna. Cras euismod, erat ac tempor elementum, enim orci gravida
            enim, sagittis fringilla metus diam in ex. Curabitur leo lorem,
            sagittis vitae sapien vitae, rutrum luctus erat. Phasellus sem nisi,
            tempor at quam et, commodo scelerisque magna. Pellentesque habitant
            morbi tristique senectus et netus et malesuada fames ac turpis
            egestas. Mauris at ex tempor, elementum felis et, tincidunt purus.
            Ut nisl nunc, iaculis vel convallis tristique, malesuada ut mauris.
            Mauris interdum, justo vitae malesuada efficitur, velit neque
            iaculis sem, non tincidunt odio leo sit amet leo. Aliquam erat
            volutpat. Morbi dignissim tristique dolor, a consequat odio bibendum
            at. Integer ac gravida mauris. Vivamus sed lorem at sapien pretium
            ullamcorper. Interdum et malesuada fames ac ante ipsum primis in
            faucibus. Mauris mollis odio et pulvinar posuere. Cras sagittis nisl
            sit amet lectus venenatis interdum ullamcorper eu lorem. Praesent
            blandit commodo lectus, imperdiet faucibus metus sollicitudin eu.
            Curabitur varius lectus sem, facilisis scelerisque ante convallis
            sed. Etiam pharetra viverra ante id ultrices. Donec pulvinar sit
            amet urna accumsan ornare. Nulla id libero eu leo mattis rhoncus eu
            vel leo. Ut sed luctus ex. Class aptent taciti sociosqu ad litora
            torquent per conubia nostra, per inceptos himenaeos. Maecenas eget
            auctor dolor. Fusce ac feugiat turpis, ac efficitur dui.
            Pellentesque eget sem dictum, ullamcorper metus at, lacinia elit.
            Curabitur condimentum mi non iaculis suscipit. Aliquam feugiat orci
            vel lacus tincidunt feugiat. Maecenas consectetur tellus lectus, at
            efficitur nisl aliquet vitae. Sed lobortis ex elit, quis dapibus
            diam venenatis in. Vestibulum malesuada ligula ac urna varius, et
            dignissim lacus vestibulum. Fusce vitae mauris sed neque tempus
            tempus. Phasellus nunc diam, consectetur accumsan nunc eu, lobortis
            ullamcorper justo. Duis elementum quam justo, ut porta lectus
            vehicula ac. Nunc ac facilisis est. Cras eu consectetur odio. Donec
            sollicitudin sed enim in consequat. Curabitur rutrum nibh nibh, eu
            pulvinar justo feugiat ac. Nulla vitae blandit lectus. Cras varius
            sapien tortor, vel convallis ligula consectetur egestas. Sed magna
            tellus, accumsan a dapibus nec, luctus vel ex. Quisque eu pretium
            dui. Aenean nec vestibulum quam. Nullam vehicula leo nulla, nec
            ornare tortor ultrices vel. Aenean vehicula feugiat gravida.
            Praesent leo felis, interdum nec nisi in, faucibus commodo lorem.
            Pellentesque quis urna nisl. Mauris ac posuere quam. Quisque tempor
            lobortis arcu eu volutpat. Nullam gravida at libero at ullamcorper.
            Vestibulum ultricies aliquam quam sed tempor. Nullam tincidunt
            ligula ac lacus aliquam iaculis. Aliquam erat volutpat. Proin eget
            lectus eu mi condimentum pretium sed non eros. Class aptent taciti
            sociosqu ad litora torquent per conubia nostra, per inceptos
            himenaeos. Nullam rutrum eu lectus id ultricies. Vestibulum porta
            vestibulum nibh, nec aliquam felis commodo ac. Aenean eu lobortis
            odio. Nulla varius lectus metus, sed vehicula diam condimentum eu.
            Donec suscipit commodo orci nec iaculis. Phasellus congue, nibh
            vitae sagittis faucibus, libero sapien semper neque, vel elementum
            neque felis sed nulla. Maecenas vitae mollis nisi. Curabitur in
            tellus quam. Phasellus efficitur urna eu ultrices interdum. Vivamus
            ut libero justo. Vestibulum tincidunt lectus vel convallis sodales.
            Quisque suscipit, mauris eu eleifend viverra, lectus velit auctor
            neque, sit amet viverra mauris tellus sed mauris. Curabitur non
            laoreet libero. Duis id scelerisque dolor, nec fringilla elit. Nam
            tellus eros, mattis dignissim est ac, ornare fermentum nunc.
            Phasellus placerat lectus at neque pellentesque laoreet et sed
            ligula. Vestibulum urna diam, mollis vel nisl ac, pellentesque
            tristique nulla. Cras sodales scelerisque eros, nec pharetra massa
            ullamcorper non. Aenean in magna mi. Quisque congue tellus id eros
            pretium sollicitudin tempus at tellus. Quisque suscipit felis eu
            nunc ultricies, vitae varius leo vestibulum. Donec elementum
            bibendum ultrices. Integer sollicitudin pretium aliquam. Mauris eget
            mi sed nunc congue vulputate. Etiam vulputate ultricies volutpat.
            Aenean sed molestie tortor, vel fermentum nibh. Etiam eget lectus in
            enim tristique sagittis. Cras lorem ante, cursus a aliquet non,
            vestibulum ac lacus. Aenean at varius dui, vitae condimentum odio.
            Nulla tincidunt sed urna vitae convallis. Donec quis venenatis
            purus, vitae aliquet felis. Curabitur dapibus tincidunt
            sollicitudin. Nullam ornare erat viverra tortor maximus pharetra.
            Fusce sit amet maximus ipsum. Pellentesque congue tellus euismod,
            rutrum justo et, vulputate sapien. In sit amet eleifend nunc. Donec
            eu lobortis nibh. Nunc eu ipsum eu nisi scelerisque consequat. Duis
            vel laoreet quam. Ut vel tortor ac neque viverra efficitur. Maecenas
            sit amet lorem odio. Quisque viverra lectus in ipsum congue feugiat.
            Nunc egestas ullamcorper justo, quis sollicitudin ipsum ullamcorper
            non. Suspendisse libero risus, placerat vel sodales imperdiet,
            pulvinar ac nunc. Aenean consectetur nibh et tortor sodales
            scelerisque. Vestibulum feugiat odio vel nunc scelerisque aliquam.
            Integer consequat sem vel orci tincidunt pulvinar. Maecenas mollis
            condimentum lacus quis tristique. In vulputate tellus lectus, ac
            lobortis quam laoreet tempor. Integer laoreet leo in pellentesque
            maximus. Quisque nunc augue, pellentesque eget orci vel, accumsan
            sollicitudin nibh. Duis vitae est luctus, pharetra neque id, commodo
            diam.
          </p>
        </div>

        <div className="mt-4 flex justify-center">
          <Link href="/">
            <button className="px-6 py-2 border border-white text-white rounded-md hover:bg-white hover:text-black transition duration-200 shadow-lg backdrop-blur-sm">
               Return to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
