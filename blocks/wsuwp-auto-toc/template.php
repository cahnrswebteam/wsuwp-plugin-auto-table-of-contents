<?php if ( ! defined( 'ABSPATH' ) ) exit;

?>
<div class="<?php echo esc_attr( $className ); ?>" aria-label="Table of contents" data-toc-max="<?php echo (int) $maxLevel; ?>">
	<div class="wsuwp-auto-toc__title">
		<h2><?php echo esc_html( $title ); ?></h2>
		<button type="button" class="wsuwp-auto-toc-toggle" aria-controls="wsuwp-auto-toc-list" aria-expanded="true" aria-label="Toggle table of contents">
			<span class="wsuwp-auto-toc-toggle__label">Hide</span>
			<span class="wsuwp-auto-toc-toggle__icon" aria-hidden="true"><i class="fa-solid fa-caret-down"></i></span>
		</button>
	</div>

	<ul class="wsuwp-auto-toc__list" id="wsuwp-auto-toc-list">
	<?php
	if ( ! empty( $headings ) ) {
		$base_level = min( array_map( static function( $h ){ return (int) $h['level']; }, $headings ) );
		$current    = $base_level;
		$firstItem  = true;

		$allowed_label_html = array(
			'em'     => array(),
			'i'      => array(),
			'strong' => array(),
			'b'      => array(),
		);

		foreach ( $headings as $h ) {
			$level = (int) $h['level'];
			$text  = isset( $h['text'] ) ? (string) $h['text'] : '';
			$html  = isset( $h['html'] ) ? (string) $h['html'] : '';
			$id    = (string) $h['anchor'];

			while ( $level > $current ) {
				echo "\n<ul>";
				$current++;
			}
			while ( $level < $current ) {
				echo "</li>\n</ul>";
				$current--;
			}
			if ( ! $firstItem ) {
				echo "</li>";
			}
			$firstItem = false;

			if ( $html !== '' ) {
				$link_label = wp_kses( $html, $allowed_label_html );
			} else {
				$link_label = esc_html( $text );
			}

			echo '<li><a href="#' . esc_attr( $id ) . '">' . $link_label . '</a>';
		}

		while ( $current > $base_level ) {
			echo "</li>\n</ul>";
			$current--;
		}
		echo "</li>";
	}
	?>
	</ul>
</div>
